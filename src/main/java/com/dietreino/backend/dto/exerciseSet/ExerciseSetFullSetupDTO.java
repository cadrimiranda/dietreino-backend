package com.dietreino.backend.dto.exerciseSet;

import com.dietreino.backend.dto.exerciseSetup.ExerciseSetupFullDTO;
import com.dietreino.backend.utils.WeekDays;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record ExerciseSetFullSetupDTO(UUID id, String name, String description, WeekDays weekDay,
                                      List<ExerciseSetupFullDTO> exerciseSetupList) {


    public ExerciseSetRequestDTO toSetRequestDTO() {
        return ExerciseSetRequestDTO
                .builder()
                .name(name)
                .description(description)
                .weekDay(weekDay)
                .build();
    }
}
