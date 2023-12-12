import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from '../constants/req.constants';
import { Request } from 'express';
import { IActiveUser } from '../types/active-use-data.type';
import { RedisService } from '../modules/redis/redis.service';
import { USER_INFO } from '../constants/redis.constants';
import { User } from 'src/users/entities/user.entity';

declare module 'express' {
  interface Request {
    [REQUEST_USER_KEY]: IActiveUser;
  }
}

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;
  @Inject()
  private readonly redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];

    const isAuthWhitelist = this.reflector.getAllAndOverride('auth-whitelist', [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      const info: User = JSON.parse(
        await this.redisService.redisClient.get(USER_INFO + user.id),
      );
    } catch {
      return false;
    }

    if (isAuthWhitelist) {
      return true;
    }

    return true;
  }
}
