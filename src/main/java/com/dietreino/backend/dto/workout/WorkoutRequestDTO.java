package com.dietreino.backend.dto.workout;

import com.dietreino.backend.domain.Workout;
import lombok.Builder;

import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

@Builder
public record WorkoutRequestDTO(String name, String description, UUID userToAssign, Date startDate, Date endDate) {
    public Workout toWorkoutEntity() {
        return Workout.builder()
                .name(name)
                .description(description)
                .startDate(startDate)
                .endDate(endDate)
                .exerciseSets(new ArrayList<>())
                .build();
    }
}
