import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableArticle1748162465691 implements MigrationInterface {
    name = 'UpdateTableArticle1748162465691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "article" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_12824e4598ee46a0992d99ba553" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_636f17dadfea1ffb4a412296a28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_636f17dadfea1ffb4a412296a28"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_12824e4598ee46a0992d99ba553"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "image"`);
    }

}
