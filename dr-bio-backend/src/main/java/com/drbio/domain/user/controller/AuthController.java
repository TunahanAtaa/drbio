package com.drbio.domain.user.controller;

import com.drbio.domain.user.dto.LoginRequestDTO;
import com.drbio.domain.user.dto.LoginResponseDTO;
import com.drbio.domain.user.entity.User;
import com.drbio.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Geçersiz e-posta veya şifre.");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Geçersiz e-posta veya şifre.");
        }

        LoginResponseDTO response = LoginResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.drbio.domain.user.dto.RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Bu e-posta adresi zaten kullanılıyor.");
        }

        if (!request.isKvkkApproved()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Kayıt olmak için KVKK metnini onaylamanız gerekmektedir.");
        }

        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(com.drbio.domain.user.entity.Role.PATIENT)
                .gender(com.drbio.domain.user.entity.Gender.OTHER) // default
                .birthDate(java.time.LocalDate.now()) // default
                .kvkkApproved(request.isKvkkApproved())
                .kvkkApprovalDate(java.time.LocalDateTime.now())
                .build();

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("Kayıt başarılı.");
    }
}
