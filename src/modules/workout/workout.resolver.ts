import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { WorkoutService } from './workout.service';
import { WorkoutType } from './workout.type';
import { CreateWorkoutInput } from './create-workout.input';
import { UpdateWorkoutInput } from './update-workout.input';
import { Workout } from '../../entities/workout.entity';

@Resolver(() => WorkoutType)
export class WorkoutResolver {
  constructor(private readonly workoutService: WorkoutService) {}

  private toWorkoutType = (entity: Workout): WorkoutType => {
    return {
      id: entity.id,
      userId: entity.user_id,
      name: entity.name,
      weekStart: entity.week_start,
      weekEnd: entity.week_end,
      isActive: entity.is_active,
      createdAt: entity.created_at,
    };
  };

  @Query(() => [WorkoutType])
  async workouts(): Promise<WorkoutType[]> {
    const entities = await this.workoutService.findAll();
    return entities.map(this.toWorkoutType);
  }

  @Query(() => WorkoutType, { nullable: true })
  async workout(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<WorkoutType | null> {
    const entity = await this.workoutService.findById(id);
    return entity ? this.toWorkoutType(entity) : null;
  }

  @Mutation(() => WorkoutType)
  async createWorkout(
    @Args('createWorkoutInput') input: CreateWorkoutInput,
  ): Promise<WorkoutType> {
    const entity = await this.workoutService.create({
      user_id: input.userId,
      name: input.name,
      week_start: input.weekStart,
      week_end: input.weekEnd,
      is_active: input.isActive ?? false,
    });
    return this.toWorkoutType(entity);
  }

  @Mutation(() => WorkoutType, { nullable: true })
  async updateWorkout(
    @Args('updateWorkoutInput') input: UpdateWorkoutInput,
  ): Promise<WorkoutType | null> {
    const updateData: Partial<Workout> = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.weekStart !== undefined) updateData.week_start = input.weekStart;
    if (input.weekEnd !== undefined) updateData.week_end = input.weekEnd;
    if (input.isActive !== undefined) updateData.is_active = input.isActive;
    const entity = await this.workoutService.update(
      Number(input.id),
      updateData,
    );
    return entity ? this.toWorkoutType(entity) : null;
  }

  @Mutation(() => Boolean)
  async deleteWorkout(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await this.workoutService.delete(id);
    return true;
  }
}
