import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;
    const password=createUserDto.password;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const alreadyCreated = await this.userRepository.findOne({ email });

    if (!alreadyCreated) {
      const user =new User().createAdmin(
        createUserDto.name,
        createUserDto.email,
        hashedPassword,
        createUserDto.profileImage,
      );
      await this.userRepository.persistAndFlush(user);

      return user;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;
    const password=createUserDto.password;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const alreadyCreated = await this.userRepository.findOne({ email });

    if (!alreadyCreated) {
      const user =new User().createUser(
        createUserDto.name,
        createUserDto.email,
        hashedPassword,
        createUserDto.profileImage,
      );
      await this.userRepository.persistAndFlush(user);

      return user;
    }
  }

  async getAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUser(userId: number): Promise<User> {
    const user: User = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('User Not Found!');
    }

    return user;
  }
  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({email: username});
  }
}