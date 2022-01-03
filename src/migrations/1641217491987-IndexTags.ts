import {MigrationInterface, QueryRunner} from "typeorm";

export class IndexTags1641217491987 implements MigrationInterface {
    name = 'IndexTags1641217491987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d90243459a697eadb8ad56e909" ON "tags" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d90243459a697eadb8ad56e909"`);
    }

}
