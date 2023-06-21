import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';




@Module({
  imports: [MikroOrmModule.forRoot(),
    UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
