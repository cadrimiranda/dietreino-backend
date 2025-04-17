import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateExerciseInput {
  @Field()
  name: string;

  @Field()
  muscleGroup: string;

  @Field({ nullable: true })
  videoLink?: string;
}
