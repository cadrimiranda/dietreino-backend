import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity('rest_intervals')
export class RestInterval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workout_exercise_id: number;

  @ManyToOne(() => WorkoutExercise, (we: WorkoutExercise) => we.restIntervals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workout_exercise_id' })
  workoutExercise: WorkoutExercise;

  @Column({ length: 30 })
  interval_time: string;

  @Column({ type: 'int' })
  order: number;
}
