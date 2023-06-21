import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/auth/auth.guard';
import { ROLES_KEY } from 'src/auth/roles.decorator';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') implements CanActivate  {

    constructor(private jwtService: JwtService, private reflector: Reflector) {
        super();
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        // 💡 See this condition
        return true;
      }

      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
 
    

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });

      
        
        if(!payload)
        throw new UnauthorizedException();

        var hasPermission=requiredRoles.some((role) => payload.roles?.includes(role));
        if(!hasPermission)
        throw new UnauthorizedException();

   
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
}