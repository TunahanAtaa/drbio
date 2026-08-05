package com.drbio.domain.report.dto;

import com.drbio.domain.doctor.dto.DoctorDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRecommendationDTO {
    private String recommendedSpecialty;
    private String message;
    private List<DoctorDTO> availableDoctors;
}
