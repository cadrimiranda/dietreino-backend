import { Injectable } from '@nestjs/common';
import { StretchRepository } from './stretch.repository';
import { Stretch } from '../../entities/stretch.entity';

@Injectable()
export class StretchService {
  constructor(private readonly repository: StretchRepository) {}

  create(data: Partial<Stretch>) {
    return this.repository.create(data);
  }

  findById(id: number) {
    return this.repository.findById(id);
  }

  findAll() {
    return this.repository.findAll();
  }

  update(id: number, data: Partial<Stretch>) {
    return this.repository.update(id, data);
  }

  delete(id: number) {
    return this.repository.delete(id);
  }
}
