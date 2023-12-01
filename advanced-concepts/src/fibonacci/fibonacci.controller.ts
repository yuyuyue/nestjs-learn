import { Controller, Get, Query } from '@nestjs/common';
import Piscina from 'piscina';
import { resolve } from 'path';

@Controller('fibonacci')
export class FibonacciController {
  private readonly fibonacciWorkerPool = new Piscina({
    filename: resolve(__dirname, 'fibonacci.worker.js'),
  });

  @Get()
  fibonacci(@Query('n') n = 10) {
    return this.fibonacciWorkerPool.run(n);
  }
}
