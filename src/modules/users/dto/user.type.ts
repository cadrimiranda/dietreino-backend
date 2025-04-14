import { ObjectType, Field, ID } from '@nestjs/graphql';
import { WorkoutType } from './workout.type';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [WorkoutType], { nullable: true })
  workouts?: WorkoutType[];
}
