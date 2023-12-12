import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/req.constants';

export const ActiveUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const user = req[REQUEST_USER_KEY];
    return field ? user[field] : user;
  },
);
