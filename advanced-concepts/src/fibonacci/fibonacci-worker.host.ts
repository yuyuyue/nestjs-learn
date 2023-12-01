import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Observable, filter, firstValueFrom, fromEvent, map } from 'rxjs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Worker } from 'worker_threads';

@Injectable()
export class FibonacciWorkerHost
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private worker: Worker;
  private message$: Observable<{ id: string; result: number }>;

  onApplicationBootstrap() {
    this.worker = new Worker(join(__dirname, 'fibonacci.worker.js'));
    this.message$ = fromEvent(this.worker, 'message') as unknown as Observable<{
      id: string;
      result: number;
    }>;
  }

  onApplicationShutdown() {
    this.worker.terminate();
  }

  run(n: number) {
    const uniqueId = randomUUID();
    this.worker.postMessage({ n, id: uniqueId });
    return firstValueFrom(
      this.message$.pipe(
        filter(({ id }) => id === uniqueId),
        map(({ result }) => result),
      ),
    );
  }
}
