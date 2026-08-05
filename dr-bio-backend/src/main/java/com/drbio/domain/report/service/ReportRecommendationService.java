package com.drbio.domain.report.service;

import com.drbio.domain.report.dto.ReportRecommendationDTO;
import java.util.List;
import java.util.UUID;

public interface ReportRecommendationService {
    List<ReportRecommendationDTO> generateRecommendations(UUID reportId);
}
