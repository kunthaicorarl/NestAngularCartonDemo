import { InjectRepository } from '@mikro-orm/nestjs';
import { Role, User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createAdmin(createUserDto: CreateUserDto): Promise<any> {
    const email = createUserDto.email;
    // const password = createUserDto.password;
    // const saltOrRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const hashedPassword = await this.hashData(createUserDto.password);
    const alreadyCreated = await this.userRepository.findOne({ email });

    if (!alreadyCreated) {
      const user = new User().createAdmin(
        createUserDto.name,
        createUserDto.email,
        hashedPassword,
        createUserDto.profileImage,
      );
      await this.userRepository.persistAndFlush(user);

      const tokens = await this.getTokens(user.id, user.email, user.roles);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;

      //return user;
    }
  }

  async signAsync(username, pass): Promise<any> {
    // Check if user exists
    const user = await this.userRepository.findOne({ email: username });
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, pass);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.email, user.roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const user = await this.userRepository.findOne({ id });
    user.upateHasRefreshToken(hashedRefreshToken);
    await this.userRepository.persistAndFlush(user);
  }
  hashData(data: string) {
    return argon2.hash(data);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;
    const password = createUserDto.password;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const alreadyCreated = await this.userRepository.findOne({ email });

    if (!alreadyCreated) {
      const user = new User().createUser(
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
    return this.userRepository.findOne({ email: username });
  }

  async getTokens(userId: number, username: string, roles: Role[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles: roles,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_EXPIRED_ACCESS_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          roles: roles,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_EXPIRED_REFRESH_SECRET,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string): Promise<any> {
    const user = await this.userRepository.findOne({ refreshToken });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email, user.roles);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
