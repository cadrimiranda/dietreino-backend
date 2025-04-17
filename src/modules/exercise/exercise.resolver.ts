import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ExerciseService } from './exercise.service';
import { ExerciseType } from './dto/exercise.type';
import { CreateExerciseInput } from './dto/create-exercise.input';
import { UpdateExerciseInput } from './dto/update-exercise.input';
import { Exercise } from 'src/entities';

@Resolver(() => ExerciseType)
export class ExercisesResolver {
  constructor(private readonly exerciseService: ExerciseService) {}

  private toExerciseType = (entity: Exercise): ExerciseType => {
    return {
      id: String(entity.id),
      name: entity.name,
      muscleGroup: entity.muscle_group,
      videoLink: entity.video_link,
    };
  };

  @Query(() => [ExerciseType])
  async exercises(): Promise<ExerciseType[]> {
    const entities = await this.exerciseService.findAll();
    return entities.map(this.toExerciseType);
  }

  @Query(() => ExerciseType, { nullable: true })
  async exercise(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<ExerciseType | null> {
    const entity = await this.exerciseService.findById(id);
    return entity ? this.toExerciseType(entity) : null;
  }

  @Mutation(() => ExerciseType)
  async createExercise(
    @Args('createExerciseInput') createExerciseInput: CreateExerciseInput,
  ): Promise<ExerciseType> {
    const entity = await this.exerciseService.create({
      name: createExerciseInput.name,
      muscle_group: createExerciseInput.muscleGroup,
      video_link: createExerciseInput.videoLink,
    });
    return this.toExerciseType(entity);
  }

  @Mutation(() => ExerciseType, { nullable: true })
  async updateExercise(
    @Args('updateExerciseInput') updateExerciseInput: UpdateExerciseInput,
  ): Promise<ExerciseType | null> {
    const updateData: Partial<Exercise> = {};
    if (updateExerciseInput.name !== undefined)
      updateData.name = updateExerciseInput.name;
    if (updateExerciseInput.muscleGroup !== undefined)
      updateData.muscle_group = updateExerciseInput.muscleGroup;
    if (updateExerciseInput.videoLink !== undefined)
      updateData.video_link = updateExerciseInput.videoLink;
    const entity = await this.exerciseService.update(
      Number(updateExerciseInput.id),
      updateData,
    );
    return entity ? this.toExerciseType(entity) : null;
  }

  @Mutation(() => Boolean)
  async deleteExercise(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await this.exerciseService.delete(id);
    return true;
  }
}
