import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWorkoutInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  weekStart: number;

  @Field(() => Int)
  weekEnd: number;

  @Field(() => Boolean, { defaultValue: false })
  isActive?: boolean;
}
