package com.drbio.domain.user.controller;

import com.drbio.domain.user.dto.UserRegisterRequestDTO;
import com.drbio.domain.user.dto.UserResponseDTO;
import com.drbio.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody UserRegisterRequestDTO request) {
        UserResponseDTO response = userService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @org.springframework.web.bind.annotation.GetMapping("/kvkk-approvals")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getKvkkApprovals(
            @org.springframework.beans.factory.annotation.Autowired com.drbio.domain.user.repository.UserRepository userRepository) {
        
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
}
