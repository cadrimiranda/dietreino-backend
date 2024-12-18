package com.dietreino.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {
    UUID activeWorkoutId;
    String name;
    String lastName;
    String email;
    String phone;
    String birthDate;
    String planExpiration;
    String planStart;
    String nextAppoitment;

    public UserRequestDTO(String john, String doe, String mail, String password) {
    }
}
