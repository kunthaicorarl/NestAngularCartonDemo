import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenStrategy } from 'src/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from 'src/auth/strategies/refreshToken.strategy';


@Module({
  imports: [JwtModule.register({}),MikroOrmModule.forFeature({ entities: [User] })],
  controllers: [UserController],
  providers: [UserService,ConfigService,AccessTokenStrategy, RefreshTokenStrategy], 
  exports: [UserService],
  
})
export class UserModule {}