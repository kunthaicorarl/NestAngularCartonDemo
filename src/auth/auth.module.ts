import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
