import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import JwtConfig from 'src/common/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/common/constants/req.constants';
import { IActiveUser } from '../types/active-use-data.type';
import { AuthType } from '../types/auth.type';

declare module 'express' {
  interface Request {
    [REQUEST_USER_KEY]: IActiveUser;
  }
}

@Injectable()
export class JwtGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;
  @Inject(JwtConfig.KEY)
  private readonly jwtConfig: ConfigType<typeof JwtConfig>;
  @Inject()
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.extractKeyFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.jwtService.verifyAsync(token, {
        ...this.jwtConfig,
      });
      req[REQUEST_USER_KEY] = user;
      return true;
    } catch {
      throw new UnauthorizedException('身份校验失败');
    }
  }
  private extractKeyFromHeader(request: Request): string | undefined {
    const [type, key] = request.headers.authorization?.split(' ') ?? [];
    return type === AuthType.Bearer ? key : undefined;
  }
}
