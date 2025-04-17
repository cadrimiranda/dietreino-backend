import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWeeklyLoadInput {
  @Field(() => Int)
  workoutExerciseId: number;

  @Field(() => Int)
  week: number;

  @Field()
  load: string;
}
