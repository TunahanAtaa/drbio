package com.drbio.domain.report.controller;

import com.drbio.domain.report.dto.MedicalReportDetailResponseDTO;
import com.drbio.domain.report.dto.MedicalReportItemDTO;
import com.drbio.domain.report.dto.MedicalReportResponseDTO;
import com.drbio.domain.report.dto.ReportRecommendationDTO;
import com.drbio.domain.report.dto.ReportTrendDTO;
import com.drbio.domain.report.entity.MedicalReport;
import com.drbio.domain.report.service.MedicalReportService;
import com.drbio.domain.report.service.ReportRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class MedicalReportController {

    private final MedicalReportService reportService;
    private final ReportRecommendationService recommendationService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicalReportResponseDTO> uploadReport(
            @RequestParam("userId") UUID userId,
            @RequestParam("reportDate") LocalDate reportDate,
            @RequestParam("file") MultipartFile file) {

        MedicalReport savedReport = reportService.createReport(userId, file, reportDate);

        MedicalReportResponseDTO responseDTO = MedicalReportResponseDTO.builder()
                .id(savedReport.getId())
                .filePath(savedReport.getFilePath())
                .status(savedReport.getStatus())
                .reportDate(savedReport.getReportDate())
                .userId(savedReport.getUser().getId())
                .build();

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalReportResponseDTO>> getUserReports(@PathVariable("userId") UUID userId) {
        List<MedicalReportResponseDTO> reports = reportService.getReportsByUserId(userId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/all")
    public ResponseEntity<List<MedicalReportResponseDTO>> getAllReports() {
        // Just calling a service method that fetches all reports. 
        // We'll add getAllReports() to reportService.
        List<MedicalReportResponseDTO> reports = reportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<MedicalReportDetailResponseDTO> getReportDetails(@PathVariable("reportId") UUID reportId) {
        MedicalReportDetailResponseDTO detail = reportService.getReportDetails(reportId);
        return ResponseEntity.ok(detail);
    }

    @GetMapping("/{reportId}/anomalies")
    public ResponseEntity<List<MedicalReportItemDTO>> getReportAnomalies(@PathVariable("reportId") UUID reportId) {
        List<MedicalReportItemDTO> anomalies = reportService.getReportAnomalies(reportId);
        return ResponseEntity.ok(anomalies);
    }

    @GetMapping("/user/{userId}/trend")
    public ResponseEntity<List<ReportTrendDTO>> getParameterTrend(
            @PathVariable("userId") UUID userId,
            @RequestParam("parameterName") String parameterName) {
        List<ReportTrendDTO> trend = reportService.getParameterTrend(userId, parameterName);
        return ResponseEntity.ok(trend);
    }

    @GetMapping("/{reportId}/recommendations")
    public ResponseEntity<List<ReportRecommendationDTO>> getReportRecommendations(@PathVariable("reportId") UUID reportId) {
        List<ReportRecommendationDTO> recommendations = recommendationService.generateRecommendations(reportId);
        return ResponseEntity.ok(recommendations);
    }

}
