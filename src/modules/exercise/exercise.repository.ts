import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../../entities/exercise.entity';

@Injectable()
export class ExerciseRepository {
  constructor(
    @InjectRepository(Exercise)
    private readonly repository: Repository<Exercise>,
  ) {}

  async create(data: Partial<Exercise>): Promise<Exercise> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Exercise | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Exercise[]> {
    return this.repository.find();
  }

  async update(id: number, data: Partial<Exercise>): Promise<Exercise | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
