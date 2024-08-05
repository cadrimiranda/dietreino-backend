package com.dietreino.backend.controllers;

import com.dietreino.backend.domain.Workout;
import com.dietreino.backend.dto.exerciseSet.ExerciseSetFullSetupDTO;
import com.dietreino.backend.dto.workout.RoutineHistoryRequest;
import com.dietreino.backend.dto.workout.WorkoutPutRequestDTO;
import com.dietreino.backend.dto.workout.WorkoutRequestDTO;
import com.dietreino.backend.services.WorkoutService;
import com.dietreino.backend.utils.CRUDController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workout")
public class WorkoutController extends CRUDController<Workout, WorkoutRequestDTO, WorkoutPutRequestDTO> {
    private final WorkoutService service;

    @Autowired
    public WorkoutController(WorkoutService service) {
        this.service = service;
    }

    @Override
    @GetMapping("/byId/{id}")
    public ResponseEntity<Workout> getById(@PathVariable UUID id) {
        Workout workout = service.findById(id);
        return ResponseEntity.ok(workout);
    }

    @Override
    public ResponseEntity<Workout> create(WorkoutRequestDTO workoutRequestDTO) {
        return null;
    }

    @PostMapping
    public ResponseEntity<Workout> create(HttpServletRequest request, @RequestBody WorkoutRequestDTO workoutRequestDTO) {
        UUID userRequestId = (UUID) request.getAttribute("user_id");
        Workout workout = service.save(workoutRequestDTO, userRequestId);
        return ResponseEntity.ok(workout);
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<Workout> update(@PathVariable UUID id, @RequestBody WorkoutPutRequestDTO requestDTO) {
        Workout workout = service.update(id, requestDTO);
        return ResponseEntity.ok(workout);
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOne(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted workout with id: " + id);
    }

    @Override
    @GetMapping("/getall")
    public ResponseEntity<List<Workout>> getAll() {
        List<Workout> workouts = service.findAll();
        return ResponseEntity.ok(workouts);
    }

    @PostMapping("/{workoutId}/exercise-set")
    public ResponseEntity<Boolean> addExerciseSet(@PathVariable UUID workoutId, @Valid @RequestBody ExerciseSetFullSetupDTO exerciseSetFullSetupDTO) {
        Workout workout = service.addSetToWorkout(workoutId, exerciseSetFullSetupDTO);
        return ResponseEntity.ok(workout != null);
    }

    @PostMapping("/{workoutId}/finish-routine")
    public ResponseEntity<Boolean> finishRoutine(@PathVariable UUID workoutId, @Valid @RequestBody List<RoutineHistoryRequest> body) {
        service.finishWorkout(workoutId, body);
        return ResponseEntity.ok(true);
    }
}
