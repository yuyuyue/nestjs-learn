import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private circuitBreakerMap: WeakMap<
    // eslint-disable-next-line @typescript-eslint/ban-types
    Function,
    CircuitBreaker
  > = new WeakMap();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodRef = context.getHandler();
    let circuitBreaker: CircuitBreaker;

    if (this.circuitBreakerMap.has(methodRef)) {
      circuitBreaker = this.circuitBreakerMap.get(methodRef);
    } else {
      circuitBreaker = new CircuitBreaker();
      this.circuitBreakerMap.set(methodRef, circuitBreaker);
    }
    return circuitBreaker.exec(next);
  }
}
