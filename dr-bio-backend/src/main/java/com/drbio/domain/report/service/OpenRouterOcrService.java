package com.drbio.domain.report.service;

import com.drbio.domain.report.dto.ReportResultItem;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Service
public class OpenRouterOcrService {

    private static final Logger logger = LoggerFactory.getLogger(OpenRouterOcrService.class);

    @Value("${openrouter.api.key:}")
    private String apiKey;

    @Value("${openrouter.api.url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Value("${openrouter.vision.model:google/gemini-2.5-flash-lite}")
    private String modelName;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public OpenRouterOcrService(RestTemplateBuilder restTemplateBuilder, ObjectMapper objectMapper) {
        this.restTemplate = restTemplateBuilder.build();
        this.objectMapper = objectMapper;
    }

    public List<ReportResultItem> extractFromImage(File imageFile) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("OPENROUTER_API_KEY is not set! OCR extraction will be skipped.");
            return new ArrayList<>();
        }

        try {
            String base64Image = encodeImageToBase64(imageFile);
            return callOpenRouterApi(base64Image, getMimeType(imageFile));
        } catch (Exception e) {
            logger.error("Error during OCR extraction from image: {}", imageFile.getName(), e);
            throw new RuntimeException("Görüntü işlenirken hata oluştu.", e);
        }
    }

    public List<ReportResultItem> extractFromScannedPdf(File pdfFile) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            logger.warn("OPENROUTER_API_KEY is not set! OCR extraction will be skipped.");
            return new ArrayList<>();
        }

        try {
            String base64Image = renderPdfFirstPageToBase64(pdfFile);
            return callOpenRouterApi(base64Image, "image/png");
        } catch (Exception e) {
            logger.error("Error during OCR extraction from PDF: {}", pdfFile.getName(), e);
            throw new RuntimeException("PDF işlenirken hata oluştu.", e);
        }
    }

    private String encodeImageToBase64(File file) throws IOException {
        byte[] fileContent = Files.readAllBytes(file.toPath());
        return Base64.getEncoder().encodeToString(fileContent);
    }

    private String getMimeType(File file) {
        String name = file.getName().toLowerCase();
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        return "image/png"; // default fallback
    }

    private String renderPdfFirstPageToBase64(File pdfFile) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            // Sadece ilk sayfayı render et (0-indexed)
            BufferedImage bim = pdfRenderer.renderImageWithDPI(0, 150);
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bim, "png", baos);
            byte[] imageBytes = baos.toByteArray();
            return Base64.getEncoder().encodeToString(imageBytes);
        }
    }

    private List<ReportResultItem> callOpenRouterApi(String base64Image, String mimeType) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName);

        // Instruct model
        String promptText = "Bu görüntüdeki tıbbi rapor/tahlil değerlerini SADECE oku ve yapılandırılmış JSON dizisi şeklinde çıkar: [{\"parameterName\": \"...\", \"value\": 12.3, \"unit\": \"...\", \"referenceRange\": \"...\"}]. Hiçbir yorum, teşhis, tavsiye üretme, sadece görüneni raporla. Cevabın SADECE JSON dizisi olsun, ```json veya benzer markdown formatı ekleme.";

        Map<String, Object> textMessage = new HashMap<>();
        textMessage.put("type", "text");
        textMessage.put("text", promptText);

        Map<String, Object> imageUrlData = new HashMap<>();
        imageUrlData.put("url", "data:" + mimeType + ";base64," + base64Image);

        Map<String, Object> imageMessage = new HashMap<>();
        imageMessage.put("type", "image_url");
        imageMessage.put("image_url", imageUrlData);

        Map<String, Object> messageContent = new HashMap<>();
        messageContent.put("role", "user");
        messageContent.put("content", Arrays.asList(textMessage, imageMessage));

        requestBody.put("messages", Collections.singletonList(messageContent));
        
        // Disable markdown wrappers if possible, but we'll clean it up anyway
        requestBody.put("temperature", 0.1);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        int maxRetries = 2;
        int attempt = 0;
        ResponseEntity<Map> response = null;

        while (attempt < maxRetries) {
            try {
                response = restTemplate.postForEntity(apiUrl, request, Map.class);
                if (response.getStatusCode() == HttpStatus.OK) {
                    break;
                }
            } catch (Exception e) {
                logger.warn("OpenRouter API çağrısı başarısız oldu. Deneme: " + (attempt + 1), e);
            }
            attempt++;
            try {
                Thread.sleep(1000); // Retry delay
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        }

        if (response == null || response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("OpenRouter API çağrısı başarısız oldu (Rate limit veya Timeout).");
        }

        return parseApiResponse(response.getBody());
    }

    private List<ReportResultItem> parseApiResponse(Map<String, Object> responseBody) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            if (choices == null || choices.isEmpty()) return new ArrayList<>();

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            if (content == null || content.trim().isEmpty()) return new ArrayList<>();

            // Temizleme: model ```json [...] ``` dönerse diye
            content = content.trim();
            if (content.startsWith("```json")) {
                content = content.substring(7);
            }
            if (content.startsWith("```")) {
                content = content.substring(3);
            }
            if (content.endsWith("```")) {
                content = content.substring(0, content.length() - 3);
            }
            content = content.trim();

            List<ReportResultItem> parsedItems = objectMapper.readValue(content, new TypeReference<List<ReportResultItem>>() {});
            
            // Eğer value null ise veya Double olarak parse edilemeyen değerler varsa filtreleyebiliriz.
            List<ReportResultItem> validItems = new ArrayList<>();
            for(ReportResultItem item : parsedItems) {
                if (item.getParameterName() != null && item.getValue() != null) {
                    validItems.add(item);
                }
            }
            
            return validItems;
            
        } catch (Exception e) {
            logger.error("OpenRouter API yanıtını JSON'a çevirirken hata oluştu.", e);
            throw new RuntimeException("OCR verisi okunamadı, dönen format geçersiz.", e);
        }
    }
}
