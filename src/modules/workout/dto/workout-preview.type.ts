import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class WorkoutExercisePreviewType {
  @Field(() => String)
  exerciseName: string;

  @Field(() => Int)
  order: number;

  @Field(() => Int)
  sets: number;

  @Field(() => String)
  repetitions: string;

  @Field(() => String, { defaultValue: '60s' })
  rest: string;

  @Field(() => String, { nullable: true })
  notes?: string;
}

@ObjectType()
export class WorkoutPreviewType {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  weekStart: number;

  @Field(() => Int)
  weekEnd: number;

  @Field(() => Boolean, { defaultValue: false })
  isActive: boolean;

  @Field(() => [WorkoutExercisePreviewType])
  exercises: WorkoutExercisePreviewType[];
}
