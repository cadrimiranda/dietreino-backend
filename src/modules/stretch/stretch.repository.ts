import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stretch } from '../../entities/stretch.entity';

@Injectable()
export class StretchRepository {
  constructor(
    @InjectRepository(Stretch)
    private readonly repository: Repository<Stretch>,
  ) {}

  async create(data: Partial<Stretch>): Promise<Stretch> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findById(id: number): Promise<Stretch | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Stretch[]> {
    return this.repository.find();
  }

  async update(id: number, data: Partial<Stretch>): Promise<Stretch | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
