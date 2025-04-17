import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class UpdateWorkoutExerciseInput {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: true })
  workoutId?: number;

  @Field(() => Int, { nullable: true })
  exerciseId?: number;

  @Field(() => Int, { nullable: true })
  order?: number;

  @Field(() => Int, { nullable: true })
  sets?: number;

  @Field({ nullable: true })
  repetitions?: string;

  @Field({ nullable: true })
  rest?: string;

  @Field({ nullable: true })
  notes?: string;
}
