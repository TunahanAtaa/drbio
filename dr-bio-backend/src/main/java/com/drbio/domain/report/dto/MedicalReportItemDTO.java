package com.drbio.domain.report.dto;

import com.drbio.domain.report.entity.ValueStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReportItemDTO {
    private UUID id;
    private String parameterName;
    private Double value;
    private String unit;
    private String referenceRange;
    private ValueStatus valueStatus;
}
