import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { WorkoutService } from './workout.service';
import { WorkoutType } from './workout.type';
import { CreateWorkoutInput } from './dto/create-workout.input';
import { UpdateWorkoutInput } from './dto/update-workout.input';
import { Workout } from '../../entities/workout.entity';
import { XlsxService } from '../xlsx/xlsx.service';
import { ProcessWorkoutFileInput } from './dto/process-workout-file.input';
import { WorkoutPreviewType } from './dto/workout-preview.type';

@Resolver(() => WorkoutType)
export class WorkoutResolver {
  constructor(
    private readonly workoutService: WorkoutService,
    private readonly xlsxService: XlsxService,
  ) {}

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

  @Mutation(() => WorkoutPreviewType)
  async processWorkoutFile(
    @Args('input') input: ProcessWorkoutFileInput,
  ): Promise<WorkoutPreviewType> {
    // Extrair os exercícios do arquivo XLSX
    const sheetExercises = await this.xlsxService.extractWorkoutSheet(
      input.file,
    );

    // Preparar a prévia do workout
    const workoutPreview: WorkoutPreviewType = {
      userId: input.userId,
      name: 'Novo Treino', // Nome default que o usuário pode alterar posteriormente
      weekStart: 1, // Valores default que o usuário pode alterar
      weekEnd: 7,
      isActive: false,
      exercises: [],
    };

    // Processar os exercícios encontrados nas planilhas
    if (sheetExercises && sheetExercises.length > 0) {
      let exerciseOrder = 1;

      // Para cada planilha que contém exercícios
      sheetExercises.forEach((sheet) => {
        // Para cada exercício na planilha
        sheet.exercises.forEach((exercise) => {
          // Obter o esquema de repetições
          const repScheme =
            exercise.repSchemes && exercise.repSchemes.length > 0
              ? exercise.repSchemes[0]
              : { sets: 3, minReps: 10, maxReps: 12 };

          // Formatar a string de repetições
          let repetitionsStr = '';
          if (repScheme.minReps === repScheme.maxReps) {
            repetitionsStr = `${repScheme.minReps}`;
          } else {
            repetitionsStr = `${repScheme.minReps}-${repScheme.maxReps}`;
          }

          // Adicionar o exercício à prévia
          workoutPreview.exercises.push({
            exerciseName: exercise.name,
            order: exerciseOrder++,
            sets: repScheme.sets,
            repetitions: repetitionsStr,
            rest: exercise.restIntervals.join(' - '), // Valor default
            notes: undefined,
          });
        });
      });
    }

    return workoutPreview;
  }
}
