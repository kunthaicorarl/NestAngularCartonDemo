import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/entities/user.entity';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_REFRESH_TOKEN_KEY = 'isRefreshToken';
export const RefreshToken = () => SetMetadata(IS_REFRESH_TOKEN_KEY, true);
