
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
import { ApiOkResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { Role, User } from './entities/user.entity';
import { AuthGuard, Public } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { SignInDto } from 'src/auth/dtos/sign-in-dto';
import { Param } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller('user')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('all')
  // @ApiOkResponse({ status: 200, type: User, isArray: true })
  @Get('all')
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':userId')
  @ApiOkResponse({ status: 200, type: User })
  async getUser(@Param('userId') userId: number): Promise<User> {
    return await this.userService.getUser(userId);
  }
   
  @Public()
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const alreadyAdmin= await this.userService.findOne(createUserDto.email.toLowerCase().trim());
    if(alreadyAdmin) 
    throw new BadRequestException('User already exists');
    return await this.userService.createAdmin(createUserDto);
  }

  @Roles(Role.Admin)
  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const alreadyAdmin= await this.userService.findOne(createUserDto.email.toLowerCase().trim());
    if(alreadyAdmin) 
    throw new BadRequestException({ cause: new Error(), description: 'User already token.' });
    return await this.userService.createUser(createUserDto);
  }

  @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
      return this.userService.login(signInDto.username, signInDto.password);
    }
    @UseGuards(AccessTokenGuard)
    @Roles(Role.Admin)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Request() req: any) {
      this.userService.logout(req.user['sub']);
    }
    @UseGuards(AccessTokenGuard)
    @Roles(Role.User)
    @Get('test')
    getTest(@Request() req) {
      return req.user;
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Request() req: any) {
      const userId = req.user['sub'];
      const refreshToken = req.user['refreshToken'];
      return this.userService.updateRefreshToken(userId, refreshToken);
    }
}