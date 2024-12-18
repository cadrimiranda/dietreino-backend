package com.dietreino.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class InvalidAccessToken extends DietreinoException {
    private final String token;

    public InvalidAccessToken(String token) {
        this.token = token;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        var pb = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        pb.setTitle("Token inválido");
        pb.setDetail("O token " + token + " é inválido e não pode ser renovado.");
        return pb;
    }
}
