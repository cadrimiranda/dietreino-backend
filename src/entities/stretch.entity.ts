import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Workout } from './workout.entity';

@Entity('stretches')
export class Stretch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workout_id: number;

  @ManyToOne(() => Workout, (workout: Workout) => workout.stretches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  order: number;
}
