import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutExercise } from '../../entities/workout-exercise.entity';

@Injectable()
export class WorkoutExerciseRepository {
  constructor(
    @InjectRepository(WorkoutExercise)
    private readonly repository: Repository<WorkoutExercise>,
  ) {}

  async create(data: Partial<WorkoutExercise>): Promise<WorkoutExercise> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<WorkoutExercise | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<WorkoutExercise[]> {
    return this.repository.find();
  }

  async update(
    id: number,
    data: Partial<WorkoutExercise>,
  ): Promise<WorkoutExercise | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
