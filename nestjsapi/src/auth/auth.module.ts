import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { UserService } from 'src/user/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [ AccessTokenStrategy,UserService],
})
export class AuthModule {}