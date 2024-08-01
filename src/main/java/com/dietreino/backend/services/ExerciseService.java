package com.dietreino.backend.services;

import com.dietreino.backend.domain.Exercise;
import com.dietreino.backend.domain.ExerciseSetup;
import com.dietreino.backend.domain.MuscularGroup;
import com.dietreino.backend.dto.exercise.ExerciseAutocompleteDTO;
import com.dietreino.backend.dto.exercise.ExerciseDTO;
import com.dietreino.backend.dto.exercise.ExerciseListPageDTO;
import com.dietreino.backend.exceptions.CannotDeleteExerciseInsideSetups;
import com.dietreino.backend.repositories.ExerciseRepository;
import com.dietreino.backend.repositories.ExerciseSetupRepository;
import com.dietreino.backend.utils.GroupMuscularEnum;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final ExerciseSetupRepository setupRepository;
    private final MuscularGroupService muscularGroupService;

    @Autowired
    public ExerciseService(ExerciseRepository exerciseRepository, ExerciseSetupRepository setupRepository, MuscularGroupService muscularGroupService) {
        this.exerciseRepository = exerciseRepository;
        this.setupRepository = setupRepository;
        this.muscularGroupService = muscularGroupService;
    }

    public ExerciseDTO domainToDTO(Exercise exercise) {
        return ExerciseDTO.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .url(exercise.getUrl())
                .muscularGroup(GroupMuscularEnum.valueOf(exercise.getMuscularGroup().getName()))
                .build();
    }

    public Exercise convertDto(ExerciseDTO exerciseRequestDTO) {
        MuscularGroup muscularGroup = muscularGroupService.findByName(exerciseRequestDTO.muscularGroup());

        return Exercise.builder()
                .id(exerciseRequestDTO.id())
                .name(exerciseRequestDTO.name())
                .description(exerciseRequestDTO.description())
                .url(exerciseRequestDTO.url())
                .image(exerciseRequestDTO.image())
                .muscularGroup(muscularGroup)
                .build();
    }

    public void validateDto(ExerciseDTO exerciseRequestDTO) {
        if (exerciseRequestDTO.name().length() < 3) {
            throw new IllegalArgumentException("Name must be at least 3 characters");
        }
    }

    public ExerciseDTO save(ExerciseDTO t) {
        validateDto(t);
        Exercise exercise = convertDto(t);
        return this.domainToDTO(exerciseRepository.save(exercise));
    }

    public ExerciseListPageDTO findAll(String name, Pageable pageable) {
        Page<Exercise> exercises = exerciseRepository.findByNameContainingIgnoreCase(name, pageable);
        return new ExerciseListPageDTO(exercises);
    }

    public Exercise findDomainById(UUID id) {
        return exerciseRepository
                .findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Exercise with id " + id + " not found")
                );
    }

    public ExerciseDTO findById(UUID id) {
        Exercise exercise = this.findDomainById(id);
        return this.domainToDTO(exercise);
    }

    @Transactional
    public ExerciseDTO update(UUID id, ExerciseDTO dto) {
        Exercise exercise = this.findDomainById(id);
        MuscularGroup muscularGroup = muscularGroupService.findByName(dto.muscularGroup());

        exercise.setName(dto.name());
        exercise.setDescription(dto.description());
        exercise.setUrl(dto.url());
        exercise.setImage(dto.image());
        exercise.setMuscularGroup(muscularGroup);

        return domainToDTO(exerciseRepository.save(exercise));
    }

    private Boolean existSetupsByExercise(UUID exerciseId) {
        List<ExerciseSetup> setups = setupRepository.findAllByExerciseId(exerciseId);
        return !setups.isEmpty();
    }

    public void delete(UUID id) {
        if (this.existSetupsByExercise(id)) {
            throw new CannotDeleteExerciseInsideSetups(id);
        }

        Exercise exercise = this.findDomainById(id);
        exerciseRepository.delete(exercise);
    }

    public List<ExerciseAutocompleteDTO> autocomplete(String name) {
        return exerciseRepository.findByNameContainingIgnoreCase(name).stream().map((exercise) ->
                new ExerciseAutocompleteDTO(exercise.getName(), exercise.getId())
        ).collect(Collectors.toList());
    }
}
