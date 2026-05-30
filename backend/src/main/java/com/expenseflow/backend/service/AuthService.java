package com.expenseflow.backend.service;

import com.expenseflow.backend.dto.LoginRequest;
import com.expenseflow.backend.dto.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    String login(LoginRequest request);
}