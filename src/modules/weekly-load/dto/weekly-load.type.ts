import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class WeeklyLoadType {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  workoutExerciseId: number;

  @Field(() => Int)
  week: number;

  @Field()
  load: string;
}
