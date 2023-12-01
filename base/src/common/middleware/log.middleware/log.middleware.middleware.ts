import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LogMiddlewareMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('req time');

    res.on('finish', () => console.timeEnd('req time'));
    next();
  }
}
