import { Migration } from '@mikro-orm/migrations';

export class Migration20230622040519 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "roles" text[] not null, "profile_image" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "refresh_token" varchar(255) null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
