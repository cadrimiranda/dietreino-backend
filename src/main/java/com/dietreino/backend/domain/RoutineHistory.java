package com.dietreino.backend.domain;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Builder
@Getter
@Setter
@Entity(name = "routine_history")
@AllArgsConstructor
@NoArgsConstructor
public class RoutineHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "serie_number")
    private int serieNumber;
    private double weight;
    private int repetition;
    @Nullable
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(name = "due_date")
    @Nullable
    private Date dueDate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_setup_id")
    private ExerciseSetup setup;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id")
    private Workout workout;
}
