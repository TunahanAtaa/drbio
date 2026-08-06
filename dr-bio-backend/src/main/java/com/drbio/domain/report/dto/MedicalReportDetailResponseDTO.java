package com.drbio.domain.report.dto;

import com.drbio.domain.report.entity.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReportDetailResponseDTO {
    private UUID id;
    private String filePath;
    private ReportStatus status;
    private LocalDate reportDate;
    private UUID userId;
    private List<MedicalReportItemDTO> items;
}
