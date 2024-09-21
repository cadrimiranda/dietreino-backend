package com.dietreino.backend.services;

import com.dietreino.backend.domain.RoutineHistory;
import com.dietreino.backend.domain.User;
import com.dietreino.backend.domain.Workout;
import com.dietreino.backend.dto.workout.RoutineHistoryRequest;
import com.dietreino.backend.dto.workout.WorkoutRequestDTO;
import com.dietreino.backend.repositories.WorkoutRepository;
import com.dietreino.backend.utils.DateUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class WorkoutServiceTest {
    private final Workout workout = Workout.builder().id(UUID.randomUUID()).build();
    @InjectMocks
    WorkoutService workoutService;
    @Mock
    WorkoutRepository workoutRepository;
    @Mock
    RoutineHistoryService routineHistoryService;
    @Mock
    UserService userService;

    @Test
    void finishWorkout() {
        var workoutId = UUID.randomUUID();
        var setupId = UUID.randomUUID();
        var entry1 = RoutineHistoryRequest.builder().exerciseSetupId(setupId).serieNumber(1).repetition(1).weight(10.0).build();
        var entry2 = RoutineHistoryRequest.builder().exerciseSetupId(setupId).serieNumber(2).repetition(2).weight(20.0).build();
        var body = new ArrayList<RoutineHistoryRequest>();
        body.add(entry1);
        body.add(entry2);

        Mockito.when(workoutRepository.findById(workoutId))
                .thenReturn(Optional.of(workout));
        Mockito.when(routineHistoryService.save(any(RoutineHistoryRequest.class), eq(workout)))
                .thenReturn(RoutineHistory.builder().build())
                .thenReturn(RoutineHistory.builder().build());

        workoutService.finishWorkout(workoutId, body);

        Mockito.verify(workoutRepository, Mockito.times(1)).findById(workoutId);
        Mockito.verify(routineHistoryService, Mockito.times(2)).save(any(RoutineHistoryRequest.class), eq(workout));
    }

    @Test
    void save() {
        var userRequestId = UUID.randomUUID();
        var userToAssign = UUID.randomUUID();
        var user = User.builder().id(userRequestId).build();
        var dto = WorkoutRequestDTO.builder().name("workout name").userToAssign(userToAssign).description("description").startDate(DateUtils.parse("2025-08-03T22:11:56.007Z")).endDate(DateUtils.parse("2025-08-03T22:11:56.007Z")).build();

        var workout = dto.toWorkoutEntity();
        workout.setCreatedBy(user);

        Mockito.when(userService.getDomainUser(userRequestId)).thenReturn(user);
        Mockito.when(workoutRepository.save(Mockito.any(Workout.class))).thenReturn(workout);
        Mockito.doNothing().when(userService).addActiveWorkout(userToAssign, workout);

        workoutService.save(dto, userRequestId);

        Mockito.verify(workoutRepository, Mockito.times(1)).save(Mockito.any(Workout.class));
        Mockito.verify(userService, Mockito.times(1)).addActiveWorkout(userToAssign, workout);
    }
}