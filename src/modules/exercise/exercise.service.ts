import { Injectable } from '@nestjs/common';
import { ExerciseRepository } from './exercise.repository';
import { Exercise } from '../../entities/exercise.entity';

@Injectable()
export class ExerciseService {
  constructor(private readonly repository: ExerciseRepository) {}

  create(data: Partial<Exercise>) {
    return this.repository.create(data);
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findAll() {
    return this.repository.findAll();
  }

  update(id: number, data: Partial<Exercise>) {
    return this.repository.update(id, data);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
