import { Module } from '@nestjs/common';
import { FibonacciController } from './fibonacci.controller';
import { FibonacciWorkerHost } from './fibonacci-worker.host';

@Module({
  providers: [FibonacciWorkerHost],
  controllers: [FibonacciController],
})
export class FibonacciModule {}
