import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SheetData {
  @Field()
  name: string;

  @Field(() => [[String]])
  data: string[][];
}

@ObjectType()
export class XlsxData {
  @Field(() => [SheetData])
  sheets: SheetData[];
}

@ObjectType()
export class RepRange {
  @Field(() => Int)
  sets: number;

  @Field(() => Int)
  minReps: number;

  @Field(() => Int)
  maxReps: number;
}

@ObjectType()
export class ExerciseInfo {
  @Field()
  name: string;

  @Field()
  rawReps: string;

  @Field(() => [RepRange])
  repSchemes: RepRange[];
}

@ObjectType()
export class SheetExercises {
  @Field()
  sheetName: string;

  @Field(() => [ExerciseInfo])
  exercises: ExerciseInfo[];
}
