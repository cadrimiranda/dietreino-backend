import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class UpdateStretchInput {
  @Field(() => ID)
  id: number;

  @Field(() => Int, { nullable: true })
  workoutId?: number;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  order?: number;
}
