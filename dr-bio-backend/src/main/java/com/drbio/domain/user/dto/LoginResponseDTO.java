package com.drbio.domain.user.dto;

import com.drbio.domain.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private UUID userId;
    private String email;
    private String fullName;
    private Role role;
}
