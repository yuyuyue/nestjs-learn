import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard';
import { AuthType } from '../types/auth.type';
import { AUTH_TYPE_KEY } from '../constants/decorator.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtGuard: JwtGuard,
  ) {}

  private static readonly defaultAuthTypes = [AuthType.Bearer];
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.jwtGuard,
    [AuthType.None]: { canActivate: () => true },
    [AuthType.ApiKey]: { canActivate: () => true },
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes =
      this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
        context.getClass(),
        context.getHandler(),
      ]) ?? AuthenticationGuard.defaultAuthTypes;
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    let error = new UnauthorizedException();
    for (const guard of guards) {
      try {
        const canActivate = await guard.canActivate(context);
        if (canActivate) {
          return true;
        }
      } catch (e) {
        error = e;
      }
    }
    throw error;
  }
}
