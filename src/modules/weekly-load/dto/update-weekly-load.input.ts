import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class UpdateWeeklyLoadInput {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: true })
  workoutExerciseId?: number;

  @Field(() => Int, { nullable: true })
  week?: number;

  @Field({ nullable: true })
  load?: string;
}
