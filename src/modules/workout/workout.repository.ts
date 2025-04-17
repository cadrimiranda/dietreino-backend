import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from '../../entities/workout.entity';

@Injectable()
export class WorkoutRepository {
  constructor(
    @InjectRepository(Workout)
    private readonly repository: Repository<Workout>,
  ) {}

  async create(data: Partial<Workout>): Promise<Workout> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Workout | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Workout[]> {
    return this.repository.find();
  }

  async update(id: number, data: Partial<Workout>): Promise<Workout | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
