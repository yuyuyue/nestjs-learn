import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST, durable: true }) // durable: 持久化
export class DataSourceService {
  constructor(@Inject(REQUEST) private readonly reqCtx: unknown) {}
}
