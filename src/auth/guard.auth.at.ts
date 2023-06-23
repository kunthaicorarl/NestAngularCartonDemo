import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
  IS_PUBLIC_KEY,
  IS_REFRESH_TOKEN_KEY,
  ROLES_KEY,
} from './roles.decorator';
import { Role } from 'src/user/entities/user.entity';

@Injectable()
export class GuardAuthAt implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const isRefreshToken = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_TOKEN_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const key = isRefreshToken
        ? process.env.JWT_REFRESH_SECRET
        : process.env.JWT_ACCESS_SECRET;
      const payload = await this.jwtService.verifyAsync(token, {
        secret: key,
      });

      if (!payload) throw new UnauthorizedException();

      if (requiredRoles) {
        const hasPermission = requiredRoles.some((role) =>
          payload.roles?.includes(role),
        );
        if (!hasPermission) throw new UnauthorizedException();
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
