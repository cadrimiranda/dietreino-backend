package com.dietreino.backend.controller;

import com.dietreino.backend.configuration.BaseTestConfiguration;
import com.dietreino.backend.configuration.TestSecurityConfig;
import com.dietreino.backend.controllers.AuthController;
import com.dietreino.backend.dto.JwtResponse;
import com.dietreino.backend.dto.LoginRequestDTO;
import com.dietreino.backend.dto.TokenRefreshRequest;
import com.dietreino.backend.dto.login.LoginResponseDTO;
import com.dietreino.backend.dto.user.UserRegisterResponse;
import com.dietreino.backend.dto.user.UserRequestDTO;
import com.dietreino.backend.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(TestSecurityConfig.class)
public class AuthControllerTests extends BaseTestConfiguration {
    @MockBean
    private AuthService authService;

    private LoginRequestDTO loginRequest;
    private UserRequestDTO userRequest;
    private TokenRefreshRequest tokenRefreshRequest;

    @BeforeEach
    void setUp() {
        loginRequest = new LoginRequestDTO("user@example.com", "password");
        userRequest = new UserRequestDTO("John", "Doe", "user@example.com", "password");
        tokenRefreshRequest = new TokenRefreshRequest("refreshToken");
    }

    @Test
    void testLogin() throws Exception {

        LoginResponseDTO mockResponse = LoginResponseDTO.builder()
                .token("mockToken")
                .build();

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(loginRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void testRegister() throws Exception {
        UUID mockUserId = UUID.randomUUID();
        UserRegisterResponse registerResponse = UserRegisterResponse.builder()
                .token("token")
                .temporaryPassword("temporaryPassword")
                .id(mockUserId)
                .name("name")
                .build();

        when(authService.register(any(UUID.class), any(UserRequestDTO.class))).thenReturn(registerResponse);

        mockMvc.perform(post("/auth/register")
                        .requestAttr("user_id", mockUserId)  // Adicionar atributo necessário
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(asJsonString(userRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(registerResponse.token()))
                .andExpect(jsonPath("$.temporaryPassword").value(registerResponse.temporaryPassword()))
                .andExpect(jsonPath("$.id").value(registerResponse.id().toString()))
                .andExpect(jsonPath("$.name").value(registerResponse.name()));
    }

    @Test
    void testRefreshToken() throws Exception {
        JwtResponse jwtResponse = new JwtResponse("newAccessToken", "refreshToken");
        when(authService.refreshToken(any(String.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"refreshToken\":\"refreshToken\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"));
    }
}