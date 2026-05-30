package com.expenseflow.backend.service.impl;

import com.expenseflow.backend.dto.LoginRequest;
import com.expenseflow.backend.dto.RegisterRequest;
import com.expenseflow.backend.entity.Role;
import com.expenseflow.backend.entity.User;
import com.expenseflow.backend.exception.BadRequestException;
import com.expenseflow.backend.exception.ResourceNotFoundException;
import com.expenseflow.backend.repository.UserRepository;
import com.expenseflow.backend.service.AuthService;
import com.expenseflow.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public String register(RegisterRequest request) {

        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    @Override
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new BadRequestException("Invalid password");
        }

        return jwtService.generateToken(user.getEmail());
    }
}