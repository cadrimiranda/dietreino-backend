import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  muscle_group: string;

  @Column({ type: 'text', nullable: true })
  video_link: string;

  @OneToMany(() => WorkoutExercise, (we: WorkoutExercise) => we.exercise)
  workoutExercises: WorkoutExercise[];
}
