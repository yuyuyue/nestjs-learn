import { Injectable } from '@nestjs/common';
import { PaymentsFailedEvent } from './events/payments-failed.event';
import { OnEvent } from '@nestjs/event-emitter';
import { ModuleRef } from '@nestjs/core';
import { EventContext } from './context/event.context';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly moduleRef: ModuleRef) {}
  @OnEvent(PaymentsFailedEvent.key)
  async cancelSubscription(event: PaymentsFailedEvent) {
    const eventContext = await this.moduleRef.resolve(
      EventContext,
      event.meta.contextId,
    );
    // 直接塞到event中的问题是造成内存的浪费，上面都是单例的
    console.log('cancel a payment Subscription', event.meta.requset.url);
  }
}
