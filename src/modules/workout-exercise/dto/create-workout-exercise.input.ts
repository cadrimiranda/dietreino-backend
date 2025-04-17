import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWorkoutExerciseInput {
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
