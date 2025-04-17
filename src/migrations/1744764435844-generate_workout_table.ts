import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class GenerateWorkoutTable1744764435844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Workout
    await queryRunner.createTable(
      new Table({
        name: 'workout',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'user_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'week_start', type: 'int' },
          { name: 'week_end', type: 'int' },
          { name: 'created_at', type: 'date', default: 'CURRENT_DATE' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'workout',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Exercises
    await queryRunner.createTable(
      new Table({
        name: 'exercises',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'muscle_group', type: 'varchar', length: '50' },
          { name: 'video_link', type: 'text', isNullable: true },
        ],
      }),
    );

    // Workout exercises
    await queryRunner.createTable(
      new Table({
        name: 'workout_exercises',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'workout_id', type: 'int' },
          { name: 'exercise_id', type: 'int' },
          { name: 'order', type: 'int' },
          { name: 'sets', type: 'int' },
          { name: 'repetitions', type: 'varchar', length: '20' },
          { name: 'rest', type: 'varchar', length: '20' },
          { name: 'notes', type: 'text', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKeys('workout_exercises', [
      new TableForeignKey({
        columnNames: ['workout_id'],
        referencedTableName: 'workout',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['exercise_id'],
        referencedTableName: 'exercises',
        referencedColumnNames: ['id'],
      }),
    ]);

    // Weekly loads
    await queryRunner.createTable(
      new Table({
        name: 'weekly_loads',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'workout_exercise_id', type: 'int' },
          { name: 'week', type: 'int' },
          { name: 'load', type: 'varchar', length: '100' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'weekly_loads',
      new TableForeignKey({
        columnNames: ['workout_exercise_id'],
        referencedTableName: 'workout_exercises',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Stretches
    await queryRunner.createTable(
      new Table({
        name: 'stretches',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'workout_id', type: 'int' },
          { name: 'description', type: 'text' },
          { name: 'order', type: 'int' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'stretches',
      new TableForeignKey({
        columnNames: ['workout_id'],
        referencedTableName: 'workout',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stretches');
    await queryRunner.dropTable('weekly_loads');
    await queryRunner.dropTable('workout_exercises');
    await queryRunner.dropTable('exercises');
    await queryRunner.dropTable('workout');
  }
}
