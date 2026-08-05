package com.drbio.domain.report.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "reference_values")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferenceValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "parameter_name", nullable = false, unique = true, length = 255)
    private String parameterName;

    @Column(name = "unit", length = 50)
    private String unit;

    @Column(name = "min_value")
    private Double minValue;

    @Column(name = "max_value")
    private Double maxValue;

    @Column(name = "low_recommendation", columnDefinition = "TEXT")
    private String lowRecommendation;

    @Column(name = "high_recommendation", columnDefinition = "TEXT")
    private String highRecommendation;

    @Column(name = "normal_recommendation", columnDefinition = "TEXT")
    private String normalRecommendation;
}
