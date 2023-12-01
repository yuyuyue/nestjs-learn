import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    console.log(defaultValue);
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.protocol;
  },
);
