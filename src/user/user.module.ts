import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { GuardAuthAt } from 'src/auth/guard.auth.at';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: GuardAuthAt,
    },
  ],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  exports: [UserService],
})
export class UserModule {}
