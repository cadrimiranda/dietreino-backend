package com.dietreino.backend.services;

import com.dietreino.backend.domain.ExerciseSetup;
import com.dietreino.backend.domain.RoutineHistory;
import com.dietreino.backend.domain.Workout;
import com.dietreino.backend.dto.workout.RoutineHistoryRequest;
import com.dietreino.backend.repositories.RoutineHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoutineHistoryService {
    private final RoutineHistoryRepository repository;
    private final ExerciseSetupService exerciseSetupService;

    @Autowired
    public RoutineHistoryService(RoutineHistoryRepository repository, ExerciseSetupService exerciseSetupService) {
        this.repository = repository;
        this.exerciseSetupService = exerciseSetupService;
    }

    public RoutineHistory save(RoutineHistoryRequest historyRequest, Workout workout) {
        ExerciseSetup setup = exerciseSetupService.findById(historyRequest.exerciseSetupId());
        RoutineHistory history = historyRequest.toRoutineEntity(workout, setup);
        return repository.save(history);
    }
}
