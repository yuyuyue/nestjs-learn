import { ContextId } from '@nestjs/core';
import { Request } from 'express';

export class PaymentsFailedEvent {
  static readonly key = 'PAYMENT_FAILED';

  constructor(
    public readonly paymentId: number,
    public readonly meta: { contextId: ContextId; requset: Request },
  ) {}
}
