package com.dietreino.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

import java.util.UUID;

public class CannotDeleteExerciseInsideSetups extends DietreinoException {
    private final UUID id;

    public CannotDeleteExerciseInsideSetups(UUID id) {
        this.id = id;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        var pb = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);
        pb.setTitle("Exercício não pode ser removido.");
        pb.setDetail("O exercicio com id " + id + " está presente em uma ou mais rotinas de treino.");
        return pb;
    }
}
