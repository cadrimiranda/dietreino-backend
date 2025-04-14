import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class WorkoutType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserType)
  user: UserType;
}
