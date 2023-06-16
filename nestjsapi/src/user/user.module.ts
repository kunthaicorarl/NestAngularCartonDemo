import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';


@Module({
  controllers: [UserController],
  providers: [UserService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  exports: [UserService],
  
})
export class UserModule {}