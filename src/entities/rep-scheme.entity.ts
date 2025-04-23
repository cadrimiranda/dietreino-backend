import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity('rep_schemes')
export class RepScheme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workout_exercise_id: number;

  @ManyToOne(() => WorkoutExercise, (we: WorkoutExercise) => we.repSchemes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workout_exercise_id' })
  workoutExercise: WorkoutExercise;

  @Column({ type: 'int' })
  sets: number;

  @Column({ type: 'int' })
  min_reps: number;

  @Column({ type: 'int' })
  max_reps: number;
}
