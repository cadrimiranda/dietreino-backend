package com.dietreino.backend.repositories;

import com.dietreino.backend.domain.RoutineHistory;
import org.hibernate.validator.constraints.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutineHistoryRepository extends JpaRepository<RoutineHistory, UUID> {
}
