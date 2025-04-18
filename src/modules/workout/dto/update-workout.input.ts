import { InputType, Field, Int, ID } from '@nestjs/graphql';

@InputType()
export class UpdateWorkoutInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  weekStart?: number;

  @Field(() => Int, { nullable: true })
  weekEnd?: number;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
