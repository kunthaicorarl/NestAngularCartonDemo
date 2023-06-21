import { Migration } from '@mikro-orm/migrations';

export class Migration20230620125625 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "refresh_token" varchar(255) null;');
  }

}
