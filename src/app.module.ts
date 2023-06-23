import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { GuardAuthAt } from './auth/guard.auth.at';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED_ACCESS_SECRET },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GuardAuthAt,
    },
  ],
})
export class AppModule {}
