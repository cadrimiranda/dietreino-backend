import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDatabase1744571534843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createDatabase('dietreino', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropDatabase('dietreino');
  }
}
