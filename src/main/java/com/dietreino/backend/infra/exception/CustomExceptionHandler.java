package com.dietreino.backend.infra.exception;

import com.dietreino.backend.exceptions.CannotDeleteExerciseInsideSetups;
import com.dietreino.backend.exceptions.IdCannotBeNullWhileFinding;
import com.dietreino.backend.exceptions.InvalidEmailOrPassword;
import com.dietreino.backend.exceptions.WorkoutWithoutUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    private ResponseEntity<ErrorMessage> illegalArgument(IllegalArgumentException exception) {
        ErrorMessage errorMessage = new ErrorMessage(exception.getMessage(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(IdCannotBeNullWhileFinding.class)
    private ResponseEntity<ErrorMessage> idCannotBeNullWhileFinding(IdCannotBeNullWhileFinding exception) {
        ErrorMessage errorMessage = new ErrorMessage(exception.getMessage(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(WorkoutWithoutUser.class)
    private ResponseEntity<ErrorMessage> workoutWithoutUser(WorkoutWithoutUser exception) {
        ErrorMessage errorMessage = new ErrorMessage(exception.getMessage(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
  
    @ExceptionHandler(CannotDeleteExerciseInsideSetups.class)
    private ResponseEntity<ErrorMessage> cannotDeleteExerciseInsideSetups(CannotDeleteExerciseInsideSetups exception) {
        ErrorMessage errorMessage = new ErrorMessage(exception.getMessage(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(InvalidEmailOrPassword.class)
    private ResponseEntity<ErrorMessage> invalidLoginEmail(InvalidEmailOrPassword exception) {
        ErrorMessage errorMessage = new ErrorMessage(exception.getMessage(), HttpStatus.BAD_REQUEST);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
}
