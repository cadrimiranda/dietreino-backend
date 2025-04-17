import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ExerciseType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  muscleGroup: string;

  @Field({ nullable: true })
  videoLink?: string;
}
