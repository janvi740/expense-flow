package com.expenseflow.backend.controller;

import com.expenseflow.backend.dto.UserProfileResponse;
import com.expenseflow.backend.entity.User;
import com.expenseflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/api/users/profile")
    public UserProfileResponse getUserProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getName(),
                user.getEmail()
        );
    }
}