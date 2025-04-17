import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateStretchInput {
  @Field(() => Int)
  workoutId: number;

  @Field()
  description: string;

  @Field(() => Int)
  order: number;
}
