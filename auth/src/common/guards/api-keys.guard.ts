import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthType } from '../types/auth.type';
import { ApiKeysService } from 'src/iam/services/api-keys/api-keys.service';

@Injectable()
export class ApiKeysGuard implements CanActivate {
  @Inject()
  private readonly apiKeysService: ApiKeysService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = this.extractKeyFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // req[REQUEST_USER_KEY] = user;
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
