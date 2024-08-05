package com.dietreino.backend.dto.exerciseSetup;

import java.util.UUID;

public record ExerciseSetupFullDTO(UUID id, UUID exerciseId, String series, String repetitions, String rest,
                                   String observation) {

    public ExerciseSetupRequestDTO toRequestDTO() {
        return ExerciseSetupRequestDTO
                .builder()
                .exerciseId(this.exerciseId)
                .series(this.series)
                .repetitions(this.repetitions)
                .rest(this.rest)
                .observation(this.observation)
                .build();
    }
}
