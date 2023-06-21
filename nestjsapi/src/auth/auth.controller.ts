

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
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserService } from 'src/user/user.service';

  @Controller('auth')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenGuard)
  export class AuthController {
    constructor(private userService: UserService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
      return this.userService.login(signInDto.username, signInDto.password);
    }

    @Roles(Role.Admin)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }

    @Get('logout')
    logout(@Request() req: any) {
      this.userService.logout(req.user['sub']);
    }

    @Roles(Role.User)
    @Get('test')
    getTest(@Request() req) {
      return req.user;
    }
  }