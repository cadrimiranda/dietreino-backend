package com.dietreino.backend.controllers;

import com.dietreino.backend.dto.JwtResponse;
import com.dietreino.backend.dto.LoginRequestDTO;
import com.dietreino.backend.dto.TokenRefreshRequest;
import com.dietreino.backend.dto.login.LoginResponseDTO;
import com.dietreino.backend.dto.user.UserRegisterResponse;
import com.dietreino.backend.dto.user.UserRequestDTO;
import com.dietreino.backend.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;


@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO body) {
        return ResponseEntity.ok(authService.login(body));
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> register(HttpServletRequest request, @RequestBody UserRequestDTO body) {
        UUID userRequestId = (UUID) request.getAttribute("user_id");
        return ResponseEntity.ok(authService.register(userRequestId, body));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        JwtResponse response = authService.refreshToken(request.refreshToken());
        return ResponseEntity.ok(response);
    }
}
