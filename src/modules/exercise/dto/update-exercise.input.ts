import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateExerciseInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  muscleGroup?: string;

  @Field({ nullable: true })
  videoLink?: string;
}
