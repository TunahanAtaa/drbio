package com.drbio.domain.report.controller;

import com.drbio.domain.report.entity.ReferenceValue;
import com.drbio.domain.report.repository.ReferenceValueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reference-values")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReferenceValueController {

    private final ReferenceValueRepository repository;

    @GetMapping
    public ResponseEntity<List<ReferenceValue>> getAll() {
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping
    public ResponseEntity<ReferenceValue> create(@RequestBody ReferenceValue referenceValue) {
        return ResponseEntity.ok(repository.save(referenceValue));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReferenceValue> update(@PathVariable UUID id, @RequestBody ReferenceValue updated) {
        return repository.findById(id).map(existing -> {
            existing.setParameterName(updated.getParameterName());
            existing.setUnit(updated.getUnit());
            existing.setMinValue(updated.getMinValue());
            existing.setMaxValue(updated.getMaxValue());
            existing.setLowRecommendation(updated.getLowRecommendation());
            existing.setHighRecommendation(updated.getHighRecommendation());
            existing.setNormalRecommendation(updated.getNormalRecommendation());
            return ResponseEntity.ok(repository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
