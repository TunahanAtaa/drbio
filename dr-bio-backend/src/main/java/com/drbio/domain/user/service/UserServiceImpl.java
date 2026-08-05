package com.drbio.domain.user.service;

import com.drbio.domain.user.dto.UserRegisterRequestDTO;
import com.drbio.domain.user.dto.UserResponseDTO;
import com.drbio.domain.user.entity.User;
import com.drbio.domain.user.exception.UserAlreadyExistsException;
import com.drbio.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserResponseDTO registerUser(UserRegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Kullanıcı zaten mevcut: " + request.getEmail());
        }

        // TODO: Hash password (e.g. with BCrypt) before saving
        String temporaryPasswordHash = request.getPassword(); 

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(temporaryPasswordHash)
                .gender(request.getGender())
                .birthDate(request.getBirthDate())
                .build();

        User savedUser = userRepository.save(user);

        return UserResponseDTO.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .gender(savedUser.getGender())
                .birthDate(savedUser.getBirthDate())
                .build();
    }
}
