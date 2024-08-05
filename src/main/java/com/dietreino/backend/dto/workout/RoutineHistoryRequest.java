package com.dietreino.backend.dto.workout;

import com.dietreino.backend.domain.ExerciseSetup;
import com.dietreino.backend.domain.RoutineHistory;
import com.dietreino.backend.domain.Workout;
import lombok.Builder;

import java.util.UUID;

@Builder
public record RoutineHistoryRequest(int serieNumber, double weight, int repetition, UUID exerciseSetupId) {
    public RoutineHistory toRoutineEntity(Workout workout, ExerciseSetup exerciseSetup) {
        return RoutineHistory.builder()
                .serieNumber(serieNumber)
                .weight(weight)
                .repetition(repetition)
                .setup(exerciseSetup)
                .workout(workout)
                .build();
    }
}
