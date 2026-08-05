package com.drbio.domain.report.repository;

import com.drbio.domain.report.entity.ReferenceValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReferenceValueRepository extends JpaRepository<ReferenceValue, UUID> {
    Optional<ReferenceValue> findByParameterName(String parameterName);
}
