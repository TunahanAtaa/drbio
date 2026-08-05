package com.drbio.domain.user.service;

import com.drbio.domain.user.dto.UserRegisterRequestDTO;
import com.drbio.domain.user.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO registerUser(UserRegisterRequestDTO request);
}
