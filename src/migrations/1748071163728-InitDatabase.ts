import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1748071163728 implements MigrationInterface {
  name = 'InitDatabase1748071163728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."article_status_enum" AS ENUM('success', 'pending', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "status" "public"."article_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TYPE "public"."article_status_enum"`);
  }
}
