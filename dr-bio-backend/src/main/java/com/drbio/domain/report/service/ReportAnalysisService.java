package com.drbio.domain.report.service;

import com.drbio.domain.report.dto.ReportResultItem;

import java.util.List;

public interface ReportAnalysisService {
    List<ReportResultItem> analyzeText(String text);
}
