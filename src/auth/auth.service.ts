import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtService: JwtService
      ) {}
    
      async signIn(username, pass) {
        const user = await this.usersService.findOne(username);
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.name };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }

}
