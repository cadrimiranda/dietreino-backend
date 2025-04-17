import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { WorkoutExercise } from './workout-exercise.entity';
import { Stretch } from './stretch.entity';

@Entity('workout')
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'int' })
  week_start: number;

  @Column({ type: 'int' })
  week_end: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  created_at: Date;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @OneToMany(() => WorkoutExercise, (we: WorkoutExercise) => we.workout)
  workoutExercises: WorkoutExercise[];

  @OneToMany(() => Stretch, (stretch: Stretch) => stretch.workout)
  stretches: Stretch[];
}
