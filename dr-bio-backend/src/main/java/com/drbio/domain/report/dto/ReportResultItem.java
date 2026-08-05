package com.drbio.domain.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResultItem {
    private String parameterName;
    private Double value;
    private String unit;
    private String referenceRange;
}
