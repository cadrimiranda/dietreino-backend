package com.dietreino.backend.services;

import com.dietreino.backend.domain.User;
import com.dietreino.backend.dto.JwtResponse;
import com.dietreino.backend.dto.LoginRequestDTO;
import com.dietreino.backend.dto.login.LoginResponseDTO;
import com.dietreino.backend.dto.user.UserLoginResponse;
import com.dietreino.backend.dto.user.UserRegisterResponse;
import com.dietreino.backend.dto.user.UserRequestDTO;
import com.dietreino.backend.exceptions.InvalidAccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {
    private final TokenService tokenService;
    private final UserService userService;

    @Autowired
    public AuthService(TokenService tokenService, UserService userService) {
        this.tokenService = tokenService;
        this.userService = userService;
    }

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userService.verifyPassword(loginRequest);
        String token = this.tokenService.generateToken(user, false);

        return LoginResponseDTO.builder()
                .token(token)
                .timeToExpire(this.tokenService.getTimeToExpire())
                .expiresAt(this.tokenService.getExpirationDate(token, false))
                .user(UserLoginResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .fullName(user.getName() + " " + user.getLastName())
                        .build())
                .build();
    }

    public JwtResponse refreshToken(String refreshToken) {
        String login = tokenService.validateToken(refreshToken, true);
        if (login != null) {
            String newAccessToken = tokenService.generateAccessToken(userService.findByEmail(login));
            return new JwtResponse(newAccessToken, refreshToken);
        } else {
            throw new InvalidAccessToken("Invalid refresh token");
        }
    }

    public UserRegisterResponse register(UUID userRequestId, UserRequestDTO dto) {
        User newUser = userService.save(dto, userRequestId);
        String token = tokenService.generateToken(newUser, false);
        return UserRegisterResponse.builder()
                .temporaryPassword(newUser.getPassword())
                .token(token)
                .id(newUser.getId())
                .build();
    }
}
