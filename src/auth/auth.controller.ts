

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
import { Roles } from './roles.decorator';
import { Role } from 'src/user/entities/user.entity';

  @Controller('auth')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @Roles(Role.Admin)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }

    @Roles(Role.User)
    @Get('test')
    getTest(@Request() req) {
      return req.user;
    }
  }