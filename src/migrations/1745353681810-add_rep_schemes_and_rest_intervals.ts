import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRepSchemesAndRestIntervals1745353681810
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela de esquemas de repetição (rep_schemes)
    await queryRunner.query(`
            CREATE TABLE "rep_schemes" (
                "id" SERIAL PRIMARY KEY,
                "workout_exercise_id" integer NOT NULL,
                "sets" integer NOT NULL,
                "min_reps" integer NOT NULL,
                "max_reps" integer NOT NULL,
                CONSTRAINT "fk_workout_exercise_rep_scheme" FOREIGN KEY ("workout_exercise_id") 
                REFERENCES "workout_exercises" ("id") ON DELETE CASCADE
            )
        `);

    // Criar tabela de intervalos de descanso (rest_intervals)
    await queryRunner.query(`
            CREATE TABLE "rest_intervals" (
                "id" SERIAL PRIMARY KEY,
                "workout_exercise_id" integer NOT NULL,
                "interval_time" varchar(30) NOT NULL,
                "order" integer NOT NULL,
                CONSTRAINT "fk_workout_exercise_rest_interval" FOREIGN KEY ("workout_exercise_id") 
                REFERENCES "workout_exercises" ("id") ON DELETE CASCADE
            )
        `);

    // Adicionar coluna raw_reps na tabela workout_exercises
    await queryRunner.query(`
            ALTER TABLE "workout_exercises" ADD COLUMN "raw_reps" varchar(100)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover a coluna raw_reps
    await queryRunner.query(
      `ALTER TABLE "workout_exercises" DROP COLUMN "raw_reps"`,
    );

    // Remover tabela de intervalos de descanso
    await queryRunner.query(`DROP TABLE "rest_intervals"`);

    // Remover tabela de esquemas de repetição
    await queryRunner.query(`DROP TABLE "rep_schemes"`);
  }
}
