package com.dietreino.backend.services;

import com.dietreino.backend.domain.User;
import com.dietreino.backend.domain.Workout;
import com.dietreino.backend.dto.LoginRequestDTO;
import com.dietreino.backend.dto.user.UserEditDTO;
import com.dietreino.backend.dto.user.UserRequestDTO;
import com.dietreino.backend.dto.user.UserResponse;
import com.dietreino.backend.dto.user.UsersByTrainerDTO;
import com.dietreino.backend.exceptions.InvalidEmailOrPassword;
import com.dietreino.backend.exceptions.WorkoutWithoutUser;
import com.dietreino.backend.repositories.UserRepository;
import com.dietreino.backend.utils.DateUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.*;
import java.util.regex.Pattern;

@Component
public class UserService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int PASSWORD_LENGTH = 12;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String generateRandomPassword() {
        byte[] randomBytes = new byte[PASSWORD_LENGTH];
        RANDOM.nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }

    private void validateDuplicatedUser(String email) {
        Optional<User> duplicatedUser = this.userRepository.findByEmail(email);

        if (duplicatedUser.isPresent()) {
            throw new IllegalArgumentException("Email address already exists");
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }

    private void validateEmail(String email) {
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email address");
        }
    }

    private void validateUserDto(UserRequestDTO userDto) {
        if (userDto.getName() == null || userDto.getName().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        validateEmail(userDto.getEmail());
    }

    private User mapDtoToEntity(UserRequestDTO userDTO, String randomPassword, UUID userRequestId) {
        Date planStartDate = DateUtils.parse(userDTO.getPlanStart());
        Date planEndDate = DateUtils.parse(userDTO.getPlanExpiration());
        User personalTrainer = userRepository.getReferenceById(userRequestId);

        return User.builder().email(userDTO.getEmail()).password(passwordEncoder.encode(randomPassword)).email(userDTO.getEmail()).name(userDTO.getName()).lastName(userDTO.getLastName()).active(true).activeWorkout(null).dateOfBirth(DateUtils.parse(userDTO.getBirthDate())).phone(userDTO.getPhone()).planExpiration(planEndDate).planStart(Optional.ofNullable(planStartDate).orElse(new Date())).shouldChangePassword(true).personalTrainer(personalTrainer).build();
    }

    public UserResponse toResponseDTO(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .lastName(user.getLastName()).fullName(user.getName() + ' ' + user.getLastName())
                .activeWorkoutId(Optional.ofNullable(user.getActiveWorkout()).map(Workout::getId).orElse(null))
                .planStart(Optional.ofNullable(user.getPlanStart()).map(Object::toString).orElse(null))
                .birthDate(Optional.ofNullable(user.getDateOfBirth()).map(Object::toString).orElse(null))
                .planExpiration(Optional.ofNullable(user.getPlanExpiration()).map(Object::toString).orElse(null))
                .nextAppointment(Optional.ofNullable(user.getNextAppointment()).map(Object::toString).orElse(null))
                .workoutExpiration(Optional.ofNullable(user.getActiveWorkout()).map(workout -> workout.getEndDate().toString()).orElse(null))
                .build();
    }

    public User updateEntity(UUID userId, UserEditDTO userDto) {
        User domainUser = this.getDomainUser(userId);
        System.out.println(userDto.getBirthDate() + " " + DateUtils.parse(userDto.getBirthDate()));
        domainUser.setName(userDto.getName());
        domainUser.setLastName(userDto.getLastName());
        domainUser.setPhone(userDto.getPhone());
        domainUser.setEmail(userDto.getEmail());
        domainUser.setDateOfBirth(DateUtils.parse(userDto.getBirthDate()));
        domainUser.setNextAppointment(DateUtils.parse(userDto.getNextAppoitment()));
        domainUser.setPlanExpiration(DateUtils.parse(userDto.getPlanExpiration()));
        domainUser.setPlanStart(DateUtils.parse(userDto.getPlanStart()));
        return domainUser;
    }

    public void addActiveWorkout(UUID userId, Workout workout) {
        User domainUser = this.getDomainUser(userId);
        domainUser.setActiveWorkout(workout);

        List<Workout> workouts = domainUser.getWorkouts();
        workouts.add(workout);
        domainUser.setWorkouts(workouts);

        userRepository.save(domainUser);
    }

    public void edit(UUID userId, UserEditDTO userDto) {
        User domainuser = this.updateEntity(userId, userDto);
        userRepository.save(domainuser);
    }

    public User save(UserRequestDTO userDTO, UUID userRequestId) {
        validateUserDto(userDTO);
        validateDuplicatedUser(userDTO.getEmail());
        String randomPassword = this.generateRandomPassword();

        User userToSave = mapDtoToEntity(userDTO, randomPassword, userRequestId);

        User savedUser = userRepository.save(userToSave);
        savedUser.setPassword(randomPassword);
        return savedUser;
    }

    public User verifyPassword(LoginRequestDTO loginRequestDTO) {
        validateEmail(loginRequestDTO.email());
        User user = this.userRepository
                .findByEmail(loginRequestDTO.email())
                .orElseThrow(InvalidEmailOrPassword::new);

        if (!passwordEncoder.matches(loginRequestDTO.password(), user.getPassword())) {
            throw new InvalidEmailOrPassword();
        }

        return user;
    }

    public User getDomainUser(UUID id) {
        return this.userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));

    }

    public UserResponse findById(UUID id) {
        User user = this.getDomainUser(id);
        return this.toResponseDTO(user);
    }

    public Workout getActiveWorkout(UUID userId) {
        Optional<Workout> workout = userRepository.findActiveWorkoutByUserId(userId);
        return workout.orElse(null);
    }

    public UsersByTrainerDTO getUsersByPersonalTrainer(UUID trainerId, Pageable pageable) {
        Page<User> userPage = userRepository.findAllByPersonalTrainerId(trainerId, pageable);
        return new UsersByTrainerDTO(userPage);
    }

    public void updateUserActive(UUID userId, boolean active) {
        User user = this.getDomainUser(userId);
        user.setActive(active);
        userRepository.save(user);
    }

    public void removeUserWorkout(UUID workoutId) {
        Optional<User> user = userRepository.findUserByActiveWorkoutId(workoutId);
        if (user.isEmpty()) {
            throw new WorkoutWithoutUser(workoutId);
        }

        User userWorkout = user.get();
        userWorkout.setActiveWorkout(null);
        userWorkout.getWorkouts().removeIf(w -> w.getId().equals(workoutId));
        userRepository.save(userWorkout);
    }

    public User findByEmail(String login) {
        return userRepository.findByEmail(login).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
