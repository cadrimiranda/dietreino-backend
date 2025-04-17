import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from './workout.repository';
import { Workout } from '../../entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(private readonly repository: WorkoutRepository) {}

  create(data: Partial<Workout>) {
    return this.repository.create(data);
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findAll() {
    return this.repository.findAll();
  }

  update(id: number, data: Partial<Workout>) {
    return this.repository.update(id, data);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
