package com.drbio.domain.report.service;

import com.drbio.domain.report.dto.MedicalReportDetailResponseDTO;
import com.drbio.domain.report.dto.MedicalReportItemDTO;
import com.drbio.domain.report.dto.MedicalReportResponseDTO;
import com.drbio.domain.report.dto.ReportTrendDTO;
import com.drbio.domain.report.entity.MedicalReport;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface MedicalReportService {
    MedicalReport createReport(UUID userId, MultipartFile file, LocalDate reportDate);
    List<MedicalReportResponseDTO> getReportsByUserId(UUID userId);
    List<MedicalReportResponseDTO> getAllReports();
    MedicalReportDetailResponseDTO getReportDetails(UUID reportId);
    List<MedicalReportItemDTO> getReportAnomalies(UUID reportId);
    List<ReportTrendDTO> getParameterTrend(UUID userId, String parameterName);
    void addDoctorNote(UUID reportId, UUID doctorId, String note);
}
