package com.dietreino.backend.exceptions;

public class InvalidEmailOrPassword extends IllegalArgumentException {
    public InvalidEmailOrPassword(String message) {
        super(message);
    }

    public InvalidEmailOrPassword() {
        super("E-mail ou senha incorretos");
    }
}
