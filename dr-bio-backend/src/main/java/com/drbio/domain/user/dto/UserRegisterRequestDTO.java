package com.drbio.domain.user.dto;

import com.drbio.domain.user.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequestDTO {
    private String email;
    private String password;
    private Gender gender;
    private LocalDate birthDate;
}
