import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from '../../entities/workout.entity';
import { WorkoutRepository } from './workout.repository';
import { WorkoutService } from './workout.service';
import { WorkoutResolver } from './workout.resolver';
import { XlsxModule } from '../xlsx/xlsx.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workout]), XlsxModule],
  providers: [WorkoutRepository, WorkoutService, WorkoutResolver],
  exports: [WorkoutService],
})
export class WorkoutModule {}
