package com.drbio.domain.report.service;

import com.drbio.common.exception.ReportNotFoundException;
import com.drbio.common.exception.UserNotFoundException;
import com.drbio.domain.report.dto.MedicalReportDetailResponseDTO;
import com.drbio.domain.report.dto.MedicalReportItemDTO;
import com.drbio.domain.report.dto.MedicalReportResponseDTO;
import com.drbio.domain.report.dto.ReportResultItem;
import com.drbio.domain.report.dto.ReportTrendDTO;
import com.drbio.domain.report.entity.MedicalReport;
import com.drbio.domain.report.entity.MedicalReportItem;
import com.drbio.domain.report.entity.ReportStatus;
import com.drbio.domain.report.entity.ValueStatus;
import com.drbio.domain.report.repository.MedicalReportItemRepository;
import com.drbio.domain.report.repository.MedicalReportRepository;
import com.drbio.domain.user.entity.User;
import com.drbio.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalReportServiceImpl implements MedicalReportService {

    private static final Logger logger = LoggerFactory.getLogger(MedicalReportServiceImpl.class);

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final MedicalReportRepository medicalReportRepository;
    private final MedicalReportItemRepository medicalReportItemRepository;
    private final TextExtractionService textExtractionService;
    private final OpenRouterOcrService openRouterOcrService;

    @Override
    @Transactional
    public MedicalReport createReport(UUID userId, MultipartFile file, LocalDate reportDate) {
        checkOwnership(userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı: " + userId));

        // 1. Dosyayı fiziksel olarak kaydet
        String filePath = fileStorageService.storeFile(file);

        List<ReportResultItem> results = new ArrayList<>();
        ReportStatus reportStatus = ReportStatus.COMPLETED;

        try {
            String mimeType = file.getContentType();
            java.io.File savedFile = new java.io.File(filePath);
            
            if (mimeType != null && mimeType.startsWith("image/")) {
                logger.info("Resim dosyası algılandı, OCR servisine gönderiliyor.");
                results = openRouterOcrService.extractFromImage(savedFile);
            } else {
                logger.info("PDF dosyası algılandı, metin çıkarma deneniyor.");
                String extractedText = textExtractionService.extractText(filePath);
                
                if (extractedText == null || extractedText.trim().isEmpty()) {
                    logger.info("PDF'ten metin çıkarılamadı (taranmış PDF). Görsel olarak OCR servisine gönderiliyor.");
                    results = openRouterOcrService.extractFromScannedPdf(savedFile);
                } else {
                    logger.info("Dijital PDF algılandı, metin üzerinden AI analizi yapılıyor.");
                    results = openRouterOcrService.extractFromText(extractedText);
                }
            }
        } catch (Exception e) {
            logger.error("Rapor verileri çıkarılırken hata oluştu: ", e);
            reportStatus = ReportStatus.FAILED;
        }

        logger.info("Parse edilen item sayısı: {}", results.size());

        // 4. Analiz sonuçlarını logla
        logger.info("--- Tahlil Raporu Analiz Sonuçları ---");
        for (ReportResultItem item : results) {
            logger.info("Parametre: {}, Değer: {}, Birim: {}, Referans: {}", 
                    item.getParameterName(), item.getValue(), item.getUnit(), item.getReferenceRange());
        }
        logger.info("---------------------------------------");

        // 5. Rapor durumunu belirle ve kaydet
        MedicalReport medicalReport = MedicalReport.builder()
                .user(user)
                .filePath(filePath)
                .status(reportStatus)
                .reportDate(reportDate)
                .build();

        List<MedicalReportItem> items = new ArrayList<>();
        for (ReportResultItem resultItem : results) {
            ValueStatus status = determineStatus(resultItem.getValue(), resultItem.getReferenceRange());

            items.add(MedicalReportItem.builder()
                    .report(medicalReport)
                    .parameterName(resultItem.getParameterName())
                    .value(resultItem.getValue())
                    .unit(resultItem.getUnit())
                    .referenceRange(resultItem.getReferenceRange())
                    .valueStatus(status)
                    .build());
        }
        medicalReport.setItems(items);

        return medicalReportRepository.save(medicalReport);
    }

    private ValueStatus determineStatus(Double value, String referenceRange) {
        if (value == null || referenceRange == null || referenceRange.trim().isEmpty()) {
            return ValueStatus.UNKNOWN;
        }

        try {
            String range = referenceRange.replace(",", ".").trim();
            String[] parts = range.split("-");

            if (parts.length == 2) {
                double min = Double.parseDouble(parts[0].trim());
                double max = Double.parseDouble(parts[1].trim());

                if (value < min) {
                    return ValueStatus.LOW;
                } else if (value > max) {
                    return ValueStatus.HIGH;
                } else {
                    return ValueStatus.NORMAL;
                }
            } else if (range.startsWith("<")) {
                double max = Double.parseDouble(range.replace("<", "").replace("=", "").trim());
                if (value > max) {
                    return ValueStatus.HIGH;
                } else {
                    return ValueStatus.NORMAL;
                }
            } else if (range.startsWith(">")) {
                double min = Double.parseDouble(range.replace(">", "").replace("=", "").trim());
                if (value < min) {
                    return ValueStatus.LOW;
                } else {
                    return ValueStatus.NORMAL;
                }
            }
        } catch (NumberFormatException e) {
            // Cannot parse the range
        }
        return ValueStatus.UNKNOWN;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalReportResponseDTO> getReportsByUserId(UUID userId) {
        checkOwnership(userId);
        List<MedicalReport> reports = medicalReportRepository.findByUserId(userId);
        return reports.stream().map(report -> MedicalReportResponseDTO.builder()
                .id(report.getId())
                .filePath(report.getFilePath())
                .status(report.getStatus())
                .reportDate(report.getReportDate())
                .userId(report.getUser().getId())
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalReportResponseDTO> getAllReports() {
        List<MedicalReport> reports = medicalReportRepository.findAll();
        return reports.stream().map(report -> MedicalReportResponseDTO.builder()
                .id(report.getId())
                .filePath(report.getFilePath())
                .status(report.getStatus())
                .reportDate(report.getReportDate())
                .userId(report.getUser().getId())
                .build()).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MedicalReportDetailResponseDTO getReportDetails(UUID reportId) {
        MedicalReport report = medicalReportRepository.findById(reportId)
                .orElseThrow(() -> new ReportNotFoundException("Tahlil raporu bulunamadı: " + reportId));
                
        checkOwnership(report.getUser().getId());

        List<MedicalReportItemDTO> itemDTOs = report.getItems().stream()
                .map(item -> MedicalReportItemDTO.builder()
                        .id(item.getId())
                        .parameterName(item.getParameterName())
                        .value(item.getValue())
                        .unit(item.getUnit())
                        .referenceRange(item.getReferenceRange())
                        .valueStatus(item.getValueStatus())
                        .build())
                .collect(Collectors.toList());

        return MedicalReportDetailResponseDTO.builder()
                .id(report.getId())
                .filePath(report.getFilePath())
                .status(report.getStatus())
                .reportDate(report.getReportDate())
                .userId(report.getUser().getId())
                .items(itemDTOs)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalReportItemDTO> getReportAnomalies(UUID reportId) {
        MedicalReport report = medicalReportRepository.findById(reportId)
                .orElseThrow(() -> new ReportNotFoundException("Tahlil raporu bulunamadı: " + reportId));
                
        checkOwnership(report.getUser().getId());

        List<MedicalReportItem> items = medicalReportItemRepository.findAnomaliesByReportId(reportId);
        return items.stream()
                .map(item -> MedicalReportItemDTO.builder()
                        .id(item.getId())
                        .parameterName(item.getParameterName())
                        .value(item.getValue())
                        .unit(item.getUnit())
                        .referenceRange(item.getReferenceRange())
                        .valueStatus(item.getValueStatus())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportTrendDTO> getParameterTrend(UUID userId, String parameterName) {
        checkOwnership(userId);
        userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Kullanıcı bulunamadı: " + userId));

        List<MedicalReportItem> items = medicalReportItemRepository.findTrendByUserIdAndParameter(userId, parameterName);
        return items.stream()
                .map(item -> ReportTrendDTO.builder()
                        .reportDate(item.getReport().getReportDate())
                        .value(item.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    private void checkOwnership(UUID targetUserId) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new org.springframework.security.access.AccessDeniedException("Giriş yapmanız gerekmektedir.");
        }
        com.drbio.domain.user.dto.SecurityUser securityUser = (com.drbio.domain.user.dto.SecurityUser) auth.getPrincipal();
        
        if (securityUser.getRole() == com.drbio.domain.user.entity.Role.ADMIN) {
            return;
        }
        
        if (!securityUser.getId().equals(targetUserId)) {
            throw new org.springframework.security.access.AccessDeniedException("Bu veriye erişim yetkiniz yok.");
        }
    }
}
