import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableTagCreateTableArticleTag1748327641257 implements MigrationInterface {
    name = 'CreateTableTagCreateTableArticleTag1748327641257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tagId" uuid NOT NULL, "articleId" uuid NOT NULL, CONSTRAINT "PK_43dc2fa69a4739ce178e021d649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "article_tag" ADD CONSTRAINT "FK_bbbd0832bdd107597b596d63f69" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "article_tag" ADD CONSTRAINT "FK_602d4921b27c9a7cb6c095992b4" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_tag" DROP CONSTRAINT "FK_602d4921b27c9a7cb6c095992b4"`);
        await queryRunner.query(`ALTER TABLE "article_tag" DROP CONSTRAINT "FK_bbbd0832bdd107597b596d63f69"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "article_tag"`);
    }

}
