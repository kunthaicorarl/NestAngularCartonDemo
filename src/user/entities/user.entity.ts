/* eslint-disable @typescript-eslint/naming-convention */
import { Property, Entity, Unique, PrimaryKey } from '@mikro-orm/core';
import { IsEmail } from 'class-validator';
export enum Role {
  User = 'user',
  Admin = 'admin',
}
@Entity()
export class User {
  @PrimaryKey()
  id!: number;
  @Property()
  name: string;

  @Property()
  @Unique()
  @IsEmail()
  email: string;

  @Property()
  password: string;

  @Property()
  roles: Role[];

  @Property({ nullable: true })
  profile_image?: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  refreshToken?: string;

  // constructor(
  //   name: string,
  //   email: string,
  //   password: string,
  //   profile_image: string,
  // ) {
  //   this.name = name;
  //   this.email = email;
  //   this.password = password;
  //   this.profile_image = profile_image;
  // }

  public createAdmin(
    name: string,
    email: string,
    password: string,
    profile_image: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profile_image = profile_image;
    this.roles = [Role.Admin, Role.User];
    return this;
  }

  public createUser(
    name: string,
    email: string,
    password: string,
    profile_image: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.profile_image = profile_image;
    this.roles = [Role.User];
    return this;
  }
  public upateHasRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }
}
