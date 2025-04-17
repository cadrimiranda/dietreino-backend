import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StretchService } from './stretch.service';
import { StretchType } from './dto/stretch.type';
import { CreateStretchInput } from './dto/create-stretch.input';
import { UpdateStretchInput } from './dto/update-stretch.input';
import { Stretch } from '../../entities/stretch.entity';

@Resolver(() => StretchType)
export class StretchResolver {
  constructor(private readonly service: StretchService) {}

  private toType = (entity: Stretch): StretchType => {
    return {
      id: entity.id,
      workoutId: entity.workout_id,
      description: entity.description,
      order: entity.order,
    };
  };

  @Query(() => [StretchType])
  async stretches(): Promise<StretchType[]> {
    const entities = await this.service.findAll();
    return entities.map(this.toType);
  }

  @Query(() => StretchType, { nullable: true })
  async stretch(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<StretchType | null> {
    const entity = await this.service.findById(id);
    return entity ? this.toType(entity) : null;
  }

  @Mutation(() => StretchType)
  async createStretch(
    @Args('createStretchInput') input: CreateStretchInput,
  ): Promise<StretchType> {
    const entity = await this.service.create({
      workout_id: input.workoutId,
      description: input.description,
      order: input.order,
    });
    return this.toType(entity);
  }

  @Mutation(() => StretchType, { nullable: true })
  async updateStretch(
    @Args('updateStretchInput') input: UpdateStretchInput,
  ): Promise<StretchType | null> {
    const updateData: Partial<Stretch> = {};
    if (input.workoutId !== undefined) updateData.workout_id = input.workoutId;
    if (input.description !== undefined)
      updateData.description = input.description;
    if (input.order !== undefined) updateData.order = input.order;
    const entity = await this.service.update(Number(input.id), updateData);
    return entity ? this.toType(entity) : null;
  }

  @Mutation(() => Boolean)
  async deleteStretch(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<boolean> {
    await this.service.delete(id);
    return true;
  }
}
