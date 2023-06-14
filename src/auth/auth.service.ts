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
        if(user==null)  throw new UnauthorizedException();
        const isMatch = await bcrypt.compare(pass, user?.password);
        if (!isMatch) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.email };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }

}
