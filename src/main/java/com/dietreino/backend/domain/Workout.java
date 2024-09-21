package com.dietreino.backend.domain;

import com.dietreino.backend.dto.workout.WorkoutPutRequestDTO;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "workout")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Workout  {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date")
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "workout_id")
    private List<ExerciseSet> exerciseSets;

    public void updateValues(WorkoutPutRequestDTO workoutRequestDTO) {
        this.name = workoutRequestDTO.name();
        this.description = workoutRequestDTO.description();
        this.endDate = workoutRequestDTO.endDate();
    }
}
