import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard, Public } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get('all')
  // @ApiOkResponse({ status: 200, type: User, isArray: true })
  @Get('all')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':userId')
  @ApiOkResponse({ status: 200, type: User })
  async getUser(@Param('userId') userId: number): Promise<User> {
    return await this.userService.getUser(userId);
  }
   
  @Public()
  @Post()
  @ApiOkResponse({ status: 201, type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }
}