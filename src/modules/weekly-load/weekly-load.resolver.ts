import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { WeeklyLoadService } from './weekly-load.service';
import { WeeklyLoadType } from './dto/weekly-load.type';
import { CreateWeeklyLoadInput } from './dto/create-weekly-load.input';
import { UpdateWeeklyLoadInput } from './dto/update-weekly-load.input';
import { WeeklyLoad } from '../../entities/weekly-load.entity';

@Resolver(() => WeeklyLoadType)
export class WeeklyLoadResolver {
  constructor(private readonly service: WeeklyLoadService) {}

  private toType = (entity: WeeklyLoad): WeeklyLoadType => {
    return {
      id: entity.id,
      workoutExerciseId: entity.workout_exercise_id,
      week: entity.week,
      load: entity.load,
    };
  };

  @Query(() => [WeeklyLoadType])
  async weeklyLoads(): Promise<WeeklyLoadType[]> {
    const entities = await this.service.findAll();
    return entities.map(this.toType);
  }

  @Query(() => WeeklyLoadType, { nullable: true })
  async weeklyLoad(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<WeeklyLoadType | null> {
    const entity = await this.service.findById(id);
    return entity ? this.toType(entity) : null;
  }

  @Mutation(() => WeeklyLoadType)
  async createWeeklyLoad(
    @Args('createWeeklyLoadInput') input: CreateWeeklyLoadInput,
  ): Promise<WeeklyLoadType> {
    const entity = await this.service.create({
      workout_exercise_id: input.workoutExerciseId,
      week: input.week,
      load: input.load,
    });
    return this.toType(entity);
  }

  @Mutation(() => WeeklyLoadType, { nullable: true })
  async updateWeeklyLoad(
    @Args('updateWeeklyLoadInput') input: UpdateWeeklyLoadInput,
  ): Promise<WeeklyLoadType | null> {
    const updateData: Partial<WeeklyLoad> = {};
    if (input.workoutExerciseId !== undefined)
      updateData.workout_exercise_id = input.workoutExerciseId;
    if (input.week !== undefined) updateData.week = input.week;
    if (input.load !== undefined) updateData.load = input.load;
    const entity = await this.service.update(Number(input.id), updateData);
    return entity ? this.toType(entity) : null;
  }

  @Mutation(() => Boolean)
  async deleteWeeklyLoad(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await this.service.delete(id);
    return true;
  }
}
