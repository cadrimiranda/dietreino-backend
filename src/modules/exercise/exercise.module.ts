import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from '../../entities/exercise.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseRepository } from './exercise.repository';
import { ExercisesResolver } from './exercise.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  providers: [ExerciseService, ExerciseRepository, ExercisesResolver],
  exports: [ExerciseService],
})
export class ExercisesModule {}
