import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/decorator.constants';
import { AuthType } from '../types/auth.type';

export const Auth = (...args: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, args);
