import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from './exercise.entity';
import { WeeklyLoad } from './weekly-load.entity';

@Entity('workout_exercises')
export class WorkoutExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workout_id: number;

  @ManyToOne(() => Workout, (workout) => workout.workoutExercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;

  @Column()
  exercise_id: number;

  @ManyToOne(() => Exercise, (exercise: Exercise) => exercise.workoutExercises)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'int' })
  sets: number;

  @Column({ length: 20 })
  repetitions: string;

  @Column({ length: 20 })
  rest: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => WeeklyLoad, (wl: WeeklyLoad) => wl.workoutExercise)
  weeklyLoads: WeeklyLoad[];
}
