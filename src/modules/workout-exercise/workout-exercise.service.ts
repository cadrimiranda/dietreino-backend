import { Injectable } from '@nestjs/common';
import { WorkoutExerciseRepository } from './workout-exercise.repository';
import { WorkoutExercise } from '../../entities/workout-exercise.entity';

@Injectable()
export class WorkoutExerciseService {
  constructor(private readonly repository: WorkoutExerciseRepository) {}

  create(data: Partial<WorkoutExercise>) {
    return this.repository.create(data);
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findAll() {
    return this.repository.findAll();
  }

  update(id: number, data: Partial<WorkoutExercise>) {
    return this.repository.update(id, data);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
