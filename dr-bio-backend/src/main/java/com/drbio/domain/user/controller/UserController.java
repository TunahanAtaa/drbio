package com.drbio.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final com.drbio.domain.user.repository.UserRepository userRepository;

    @org.springframework.web.bind.annotation.GetMapping
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getAllUsers() {
        
        java.util.List<java.util.Map<String, Object>> result = userRepository.findAll().stream()
                .map(user -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", user.getId());
                    map.put("name", user.getFullName());
                    map.put("email", user.getEmail());
                    map.put("role", user.getRole());
                    map.put("status", "ACTIVE"); // Varsayılan
                    map.put("regDate", "2026-08-01");
                    
                    // healthProfile için mock/varsayılan dönüyoruz (gerçek veritabanında henüz healthProfile tablosu yok)
                    java.util.Map<String, String> healthProfile = new java.util.HashMap<>();
                    healthProfile.put("age", "30");
                    healthProfile.put("weight", "70");
                    healthProfile.put("height", "175");
                    healthProfile.put("gender", user.getGender() != null ? user.getGender().name() : "Belirtilmedi");
                    map.put("healthProfile", healthProfile);
                    
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }
    @org.springframework.web.bind.annotation.GetMapping("/kvkk-approvals")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getKvkkApprovals() {
        
        java.util.List<java.util.Map<String, Object>> result = userRepository.findAll().stream()
                .filter(com.drbio.domain.user.entity.User::isKvkkApproved)
                .map(user -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("email", user.getEmail());
                    map.put("fullName", user.getFullName());
                    map.put("role", user.getRole());
                    map.put("approvalDate", user.getKvkkApprovalDate());
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@org.springframework.web.bind.annotation.PathVariable java.util.UUID userId) {
        com.drbio.domain.user.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        if (user.getRole() == com.drbio.domain.user.entity.Role.ADMIN) {
            long adminCount = userRepository.countByRole(com.drbio.domain.user.entity.Role.ADMIN);
            if (adminCount <= 1) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Sistemde en az 1 admin bulunmalıdır. Son admin hesabı silinemez."));
            }
        }

        userRepository.delete(user);
        return ResponseEntity.ok(java.util.Map.of("message", "Kullanıcı ve tüm verileri kalıcı olarak silindi."));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{userId}/role")
    public ResponseEntity<?> changeUserRole(
            @org.springframework.web.bind.annotation.PathVariable java.util.UUID userId,
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> body) {
        
        String newRoleStr = body.get("role");
        if (newRoleStr == null || (!newRoleStr.equals("ADMIN") && !newRoleStr.equals("PATIENT"))) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Geçersiz rol değeri."));
        }

        com.drbio.domain.user.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı."));

        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.drbio.domain.user.dto.SecurityUser) {
            com.drbio.domain.user.dto.SecurityUser currentUser = (com.drbio.domain.user.dto.SecurityUser) auth.getPrincipal();
            if (currentUser.getId().equals(userId) && user.getRole() == com.drbio.domain.user.entity.Role.ADMIN && newRoleStr.equals("PATIENT")) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Kendi rolünüzü PATIENT olarak değiştiremezsiniz."));
            }
        }

        user.setRole(com.drbio.domain.user.entity.Role.valueOf(newRoleStr));
        userRepository.save(user);

        return ResponseEntity.ok(java.util.Map.of("message", "Kullanıcı rolü güncellendi."));
    }
}
