import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { SignInDto } from './dtos/sign-in-dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public, RefreshToken, Roles } from './roles.decorator';
import { Role } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RefreshTokenDto } from './dtos/refresh-token-dto';
import { GuardAuthAt } from './guard.auth.at';
import { GuardAuthRt } from './guard.auth.rt';

@Controller('auth')
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(
    // private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.userService.signAsync(signInDto.username, signInDto.password);
  }

  @RefreshToken()
  @UseGuards(GuardAuthRt)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() input: RefreshTokenDto) {
    return await this.userService.refreshTokens(input.refreshToken);
  }
  @UseGuards(GuardAuthAt)
  @Roles(Role.Admin)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @Roles(Role.User)
  @UseGuards(GuardAuthAt)
  @Get('test')
  getTest(@Request() req) {
    return req.user;
  }
}
