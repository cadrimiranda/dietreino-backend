import { Injectable } from '@nestjs/common';
import { WeeklyLoadRepository } from './weekly-load.repository';
import { WeeklyLoad } from '../../entities/weekly-load.entity';

@Injectable()
export class WeeklyLoadService {
  constructor(private readonly repository: WeeklyLoadRepository) {}

  create(data: Partial<WeeklyLoad>) {
    return this.repository.create(data);
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findAll() {
    return this.repository.findAll();
  }

  update(id: number, data: Partial<WeeklyLoad>) {
    return this.repository.update(id, data);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
