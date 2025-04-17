import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyLoad } from '../../entities/weekly-load.entity';

@Injectable()
export class WeeklyLoadRepository {
  constructor(
    @InjectRepository(WeeklyLoad)
    private readonly repository: Repository<WeeklyLoad>,
  ) {}

  async create(data: Partial<WeeklyLoad>): Promise<WeeklyLoad> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<WeeklyLoad | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<WeeklyLoad[]> {
    return this.repository.find();
  }

  async update(
    id: number,
    data: Partial<WeeklyLoad>,
  ): Promise<WeeklyLoad | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
