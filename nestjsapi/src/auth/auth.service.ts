import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
@Injectable()
export class AuthService {

    // constructor(
    //     private usersService: UserService,
    //     private jwtService: JwtService,
    //     private readonly configService: ConfigService,
    //   ) {}
    
    //   // async signIn(username, pass) :Promise<any> {
    //   //    await this.usersService.signIn(username,pass);
    //   // }



    //   hashData(data: string) {
    //     return argon2.hash(data);
    //   }

    //   async getTokens(userId: Number, username: string) {
    //     const [accessToken, refreshToken] = await Promise.all([
    //       this.jwtService.signAsync(
    //         {
    //           sub: userId,
    //           username,
    //         },
    //         {
    //           secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    //           expiresIn: '15m',
    //         },
    //       ),
    //       this.jwtService.signAsync(
    //         {
    //           sub: userId,
    //           username,
    //         },
    //         {
    //           secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    //           expiresIn: '7d',
    //         },
    //       ),
    //     ]);
    
    //     return {
    //       accessToken,
    //       refreshToken,
    //     };
    //   }
    //   async logout(id: number) {
    //           await this.usersService.logout(id);
    //   }

}
