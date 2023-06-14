

import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard, Public } from './auth.guard';
  import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in-dto';
import { ApiBearerAuth } from '@nestjs/swagger';

  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }
    @Get('profile')
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    getProfile(@Request() req) {
      return req.user;
    }

    @Get('test')
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    getTest(@Request() req) {
      return req.user;
    }
  }