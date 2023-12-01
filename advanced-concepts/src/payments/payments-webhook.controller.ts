import { Controller, Get, Req } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentsFailedEvent } from './events/payments-failed.event';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Request } from 'express';

@Controller('payments-webhook')
export class PaymentsWebhookController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly moduleRef: ModuleRef,
  ) {}

  @Get()
  webhook(@Req() requset: Request) {
    const contextId = ContextIdFactory.create();
    const paymentId = Math.floor(Math.random() * 10000000000);
    this.moduleRef.registerRequestByContextId(requset, contextId);

    this.eventEmitter.emit(
      PaymentsFailedEvent.key,
      new PaymentsFailedEvent(paymentId, { contextId, requset }),
    );
  }
}
