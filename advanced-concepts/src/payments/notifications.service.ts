import { Injectable } from '@nestjs/common';
import { PaymentsFailedEvent } from './events/payments-failed.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  @OnEvent(PaymentsFailedEvent.key)
  sendPaymentNotification(event: PaymentsFailedEvent) {
    console.log('Send a payment notification');
  }
}
