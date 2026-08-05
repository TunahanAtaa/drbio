package com.drbio.domain.report.dto;

import com.drbio.domain.report.entity.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReportResponseDTO {
    private UUID id;
    private String filePath;
    private ReportStatus status;
    private LocalDate reportDate;
    private UUID userId;
    private String doctorNote;
    private String doctorName;
}
