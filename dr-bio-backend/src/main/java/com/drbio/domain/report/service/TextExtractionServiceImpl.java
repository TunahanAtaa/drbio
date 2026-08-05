package com.drbio.domain.report.service;

import com.drbio.common.exception.FileStorageException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class TextExtractionServiceImpl implements TextExtractionService {

    @Override
    public String extractText(String filePath) {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new FileStorageException("Metin çıkarılacak dosya bulunamadı: " + filePath);
        }

        try (PDDocument document = Loader.loadPDF(file)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        } catch (IOException e) {
            throw new FileStorageException("PDF dosyasından metin okunurken hata oluştu: " + filePath, e);
        }
    }
}
