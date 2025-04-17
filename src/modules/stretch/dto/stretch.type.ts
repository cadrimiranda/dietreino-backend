import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class StretchType {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  workoutId: number;

  @Field()
  description: string;

  @Field(() => Int)
  order: number;
}
