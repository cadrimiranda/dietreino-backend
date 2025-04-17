import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class WorkoutExerciseType {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  workoutId: number;

  @Field(() => Int)
  exerciseId: number;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  sets: number;

  @Field()
  repetitions: string;

  @Field()
  rest: string;

  @Field({ nullable: true })
  notes?: string;
}
