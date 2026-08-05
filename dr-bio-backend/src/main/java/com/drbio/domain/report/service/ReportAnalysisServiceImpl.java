package com.drbio.domain.report.service;

import com.drbio.domain.report.dto.ReportResultItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ReportAnalysisServiceImpl implements ReportAnalysisService {

    // Regex: Lazy parametre adı yakalama, boşluk veya dikey çizgi ayırıcı
    private static final String LINE_BASED_REGEX = "([a-zA-Z0-9\\s\\(\\)#%üıışğçÜİŞĞÇ\\-\\+]+?)\\s*(?:\\||\\s+)\\s*([<>]?\\s*[0-9]+[.,]?[0-9]*)\\s*(?:\\||\\s+)\\s*([^|]*?)\\s*(?:\\||\\s+)\\s*([0-9]+[.,]?[0-9]*\\s*-\\s*[0-9]+[.,]?[0-9]*)";
    private static final Pattern LINE_PATTERN = Pattern.compile(LINE_BASED_REGEX);

    // Blok bazlı eşleştirme için ortak parametreler
    private static final List<String> BLOCK_PARAMS = Arrays.asList("ALT", "AST", "Albümin", "ALP", "CRP", "Glikoz");

    @Override
    public List<ReportResultItem> analyzeText(String text) {
        List<ReportResultItem> results = new ArrayList<>();

        if (text == null || text.trim().isEmpty()) {
            return results;
        }

        String[] lines = text.split("\\r?\\n");

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;

            // 1. Satır Bazlı Yakalama (Line-Based)
            Matcher matcher = LINE_PATTERN.matcher(line);
            if (matcher.find()) {
                String paramName = matcher.group(1).trim();
                String valueStr = matcher.group(2).trim();
                String unit = matcher.group(3) != null ? matcher.group(3).trim() : "";
                String referenceRange = matcher.group(4).trim();

                Double parsedValue = parseValue(valueStr);
                if (parsedValue != null) {
                    results.add(ReportResultItem.builder()
                            .parameterName(paramName)
                            .value(parsedValue)
                            .unit(unit)
                            .referenceRange(referenceRange)
                            .build());
                }
                continue;
            }

            // 2. Basit İndeks Kontrollü Blok Yakalama
            boolean isKnownParam = false;
            for (String p : BLOCK_PARAMS) {
                if (line.equalsIgnoreCase(p)) {
                    isKnownParam = true;
                    break;
                }
            }

            if (isKnownParam) {
                // Sonraki 1-2 satıra bakıp doğrudan sayısal değeri bul
                for (int j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                    String nextLine = lines[j].trim();
                    if (nextLine.matches("^([<>]?\\s*[0-9]+[.,]?[0-9]*)$")) {
                        Double parsedValue = parseValue(nextLine);
                        if (parsedValue != null) {
                            results.add(ReportResultItem.builder()
                                    .parameterName(line) // Bulunan isim
                                    .value(parsedValue)
                                    .unit("") 
                                    .referenceRange("")
                                    .build());
                        }
                        break;
                    }
                }
            }
        }

        return results;
    }

    private Double parseValue(String valueStr) {
        if (valueStr == null || valueStr.isEmpty()) {
            return null;
        }
        // Temizlik: < veya > gibi işaretleri sil
        String cleaned = valueStr.replaceAll("[<>]", "").trim();
        // Virgülü noktaya çevir ("10,4" -> "10.4")
        cleaned = cleaned.replace(",", ".");
        try {
            return Double.parseDouble(cleaned);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
