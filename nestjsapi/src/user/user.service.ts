import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAdmin(createUserDto: CreateUserDto):Promise<any> {
    const email = createUserDto.email;
    // const password=createUserDto.password;
    // const saltOrRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const hashedPassword = await this.hashData(createUserDto.password);
    const alreadyCreated = await this.userRepository.findOne({ email });

    

    if (!alreadyCreated) {
      const user =new User().createAdmin(
        createUserDto.name,
        createUserDto.email,
        hashedPassword,
        createUserDto.profileImage,
      );
      await this.userRepository.persistAndFlush(user);

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }
  }
  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    const user = await this.userRepository.findOne({id});
    user.updatRefreshToken(hashedRefreshToken);
    await this.userRepository.persistAndFlush(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const email = createUserDto.email;
    // const password=createUserDto.password;
    // const saltOrRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const hashedPassword = await this.hashData(createUserDto.password);
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

  async getTokens(userId: Number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
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
  async logout(id:number){
    const user = await this.userRepository.findOne({id});
    user.updatRefreshToken(null);
    await this.userRepository.persistAndFlush(user);
  }

  async login(username,pass)
  {
    const user = await this.userRepository.findOne(username);
    if (!user) throw new BadRequestException('User does not exist');

    // const isMatch = await bcrypt.compare(pass, user?.password);
    // if (!isMatch) {
    //   throw new UnauthorizedException();
    // }
    const passwordMatches = await argon2.verify(user.password, pass);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    // const payload = { sub: user.id, username: user.email,roles:user.roles };
    // return {
    //   access_token: await this.jwtService.signAsync(payload),
    // };

    const tokens = await this.getTokens(user.id, user.email);
    const hashedRefreshToken = await this.hashData(tokens.refreshToken);
    const data = await this.userRepository.findOne({id: user.id});
    data.updatRefreshToken(hashedRefreshToken);
    await this.userRepository.persistAndFlush(data);
    return tokens;
  }
 
}