package com.drbio.domain.report.service;

import com.drbio.domain.report.dto.MedicalReportItemDTO;
import com.drbio.domain.report.dto.ReportRecommendationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportRecommendationServiceImpl implements ReportRecommendationService {

    private final MedicalReportService medicalReportService;

    @Override
    public List<ReportRecommendationDTO> generateRecommendations(UUID reportId) {
        // Anormallikleri çek
        List<MedicalReportItemDTO> anomalies = medicalReportService.getReportAnomalies(reportId);
        
        // Branş ve Mesaj haritası (Aynı branşı tekrar eklememek için Map kullanıyoruz)
        Map<String, String> branchRecommendations = new HashMap<>();
        
        for (MedicalReportItemDTO item : anomalies) {
            String param = item.getParameterName().toUpperCase();
            
            if (param.contains("CRP") || param.contains("WBC")) {
                branchRecommendations.put("Enfeksiyon Hastalıkları", "Enfeksiyon veya iltihap bulguları nedeniyle Enfeksiyon Hastalıkları uzmanına görünmeniz önerilir.");
                branchRecommendations.put("Dahiliye", "CRP/WBC değerlerindeki anormallik sebebiyle Dahiliye uzmanına başvurabilirsiniz.");
            } else if (param.contains("ALT") || param.contains("AST")) {
                branchRecommendations.put("Gastroenteroloji", "Karaciğer enzimlerinizdeki yükseklik/düşüklük nedeniyle Gastroenteroloji uzmanına başvurmanız önerilir.");
                branchRecommendations.put("Dahiliye", "Karaciğer enzimlerinizdeki anormallik nedeniyle Dahiliye uzmanına başvurabilirsiniz.");
            } else if (param.contains("GLİKOZ") || param.contains("GLUCOSE") || param.contains("HBA1C")) {
                branchRecommendations.put("Endokrinoloji", "Kan şekeri seviyelerinizdeki anormallik nedeniyle Endokrinoloji uzmanına görünmeniz önerilir.");
            } else if (param.contains("HGB") || param.contains("DEMİR") || param.contains("FERRİTİN")) {
                branchRecommendations.put("Hematoloji", "Kan değerlerinizdeki (HGB vb.) anormallik nedeniyle Hematoloji uzmanına görünmeniz önerilir.");
            }
        }
        
        // Eğer hiçbir kurala uymadıysa ama anormallik varsa genel bir tavsiye ver
        if (branchRecommendations.isEmpty() && !anomalies.isEmpty()) {
            branchRecommendations.put("Dahiliye", "Genel tahlil anormallikleri tespit edilmiştir. Değerlendirilmeleri için İç Hastalıkları (Dahiliye) uzmanına görünmeniz önerilir.");
        }

        List<ReportRecommendationDTO> recommendations = new ArrayList<>();
        
        for (Map.Entry<String, String> entry : branchRecommendations.entrySet()) {
            String specialty = entry.getKey();
            String message = entry.getValue();
            recommendations.add(ReportRecommendationDTO.builder()
                    .recommendedSpecialty(specialty)
                    .message(message)
                    .build());
        }
        
        return recommendations;
    }
}
