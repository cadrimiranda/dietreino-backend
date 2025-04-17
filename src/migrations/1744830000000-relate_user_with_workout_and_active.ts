import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class RelateUserWithWorkoutAndActive1744830000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona coluna user_id se não existir
    const table = await queryRunner.getTable('workout');
    if (table && !table.columns.find((col) => col.name === 'user_id')) {
      await queryRunner.addColumn(
        'workout',
        new TableColumn({
          name: 'user_id',
          type: 'uuid',
          isNullable: false,
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
    }

    // Adiciona coluna is_active
    await queryRunner.addColumn(
      'workout',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );

    // Garante que só pode haver 1 workout ativo por user
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS unique_active_workout_per_user ON workout (user_id) WHERE is_active`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IF EXISTS unique_active_workout_per_user',
    );
    await queryRunner.dropColumn('workout', 'is_active');
    const table = await queryRunner.getTable('workout');
    if (table && table.columns.find((col) => col.name === 'user_id')) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('workout', foreignKey);
      }
      await queryRunner.dropColumn('workout', 'user_id');
    }
  }
}
