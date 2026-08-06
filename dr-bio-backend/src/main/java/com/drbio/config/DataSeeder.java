package com.drbio.config;

import com.drbio.domain.user.entity.Gender;
import com.drbio.domain.user.entity.Role;
import com.drbio.domain.user.entity.User;
import com.drbio.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        createUserIfNotExists(
                "admin@drbio.com",
                "admin123",
                "Admin Kullanıcı",
                Gender.MALE,
                LocalDate.of(1985, 1, 15),
                Role.ADMIN
        );

        createUserIfNotExists(
                "hasta@drbio.com",
                "hasta123",
                "Ayşe Demir",
                Gender.FEMALE,
                LocalDate.of(1995, 3, 10),
                Role.PATIENT
        );

        log.info("DataSeeder: Test kullanıcıları kontrol edildi / oluşturuldu.");
    }

    private void createUserIfNotExists(String email, String password, String fullName,
                                       Gender gender, LocalDate birthDate, Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .fullName(fullName)
                    .gender(gender)
                    .birthDate(birthDate)
                    .role(role)
                    .build();
            userRepository.save(user);
            log.info("DataSeeder: '{}' kullanıcısı oluşturuldu (Rol: {}).", email, role);
        }
    }
}
