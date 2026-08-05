package com.drbio.domain.report.repository;

import com.drbio.domain.report.entity.MedicalReportItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalReportItemRepository extends JpaRepository<MedicalReportItem, UUID> {

    @Query("SELECT i FROM MedicalReportItem i WHERE i.report.id = :reportId AND i.valueStatus IN ('LOW', 'HIGH')")
    List<MedicalReportItem> findAnomaliesByReportId(@Param("reportId") UUID reportId);

    @Query("SELECT i FROM MedicalReportItem i JOIN i.report r WHERE r.user.id = :userId AND i.parameterName = :parameterName AND r.status = 'COMPLETED' ORDER BY r.reportDate ASC")
    List<MedicalReportItem> findTrendByUserIdAndParameter(@Param("userId") UUID userId, @Param("parameterName") String parameterName);
}
