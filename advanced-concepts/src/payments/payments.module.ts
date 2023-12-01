import { Module } from '@nestjs/common';
import { PaymentsWebhookModule } from './payments-webhook.module';

@Module({
  imports: [PaymentsWebhookModule],
})
export class PaymentsModule {}
