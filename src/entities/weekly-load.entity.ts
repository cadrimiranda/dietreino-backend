import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity('weekly_loads')
export class WeeklyLoad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workout_exercise_id: number;

  @ManyToOne(() => WorkoutExercise, (we: WorkoutExercise) => we.weeklyLoads, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workout_exercise_id' })
  workoutExercise: WorkoutExercise;

  @Column({ type: 'int' })
  week: number;

  @Column({ length: 100 })
  load: string;
}
