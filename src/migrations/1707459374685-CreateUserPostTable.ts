import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPostTable1707459374685 implements MigrationInterface {
  name = 'CreateUserPostTable1707459374685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE posts (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`), CONSTRAINT \`FK_5c1cf55c308037b5aca1038a131\` FOREIGN KEY (\`userId\`) REFERENCES users(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE refresh_token (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`), \`isRevoked\` BOOLEAN NOT NULL DEFAULT 0, \`expiredAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT \`FK_5c1cf55c308037b5aca1038a132\` FOREIGN KEY (\`userId\`) REFERENCES users(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE posts DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a131\``,
    );
    await queryRunner.query(
      `ALTER TABLE posts DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a132\``,
    );
    await queryRunner.query(`DROP TABLE refresh_token`);
    await queryRunner.query(`DROP TABLE posts`);
    await queryRunner.query(`DROP TABLE users`);
  }
}
