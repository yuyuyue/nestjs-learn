import { CallHandler } from '@nestjs/common';
import { tap, throwError } from 'rxjs';

// 成功阈值
const SUCCESS_THRESHOLD = 3;
// 失败阈值
const FAILURE_THRESHOLD = 3;
// 打开到半开操作等待时间
const OPEN_TO_HALF_OP_WAIT_TIME = 60000;

enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  HALF_OPEN = 'HALF_OPEN',
  OPEN = 'OPEN',
}

export class CircuitBreaker {
  // 状态：CircuitBreaker状态
  private state = CircuitBreakerState.CLOSED;
  // 成功次数
  private successCount = 0;
  // 失败次数
  private failureCount = 0;
  // 最后一次错误
  private lastError: Error;
  // 下次尝试时间
  private nextAttemptTime: number;

  // 执行函数，传入一个CallHandler参数
  exec(next: CallHandler) {
    // 如果当前状态为CircuitBreakerState.OPEN
    if (this.state === CircuitBreakerState.OPEN) {
      // 如果下次尝试时间大于当前时间
      if (this.nextAttemptTime > Date.now()) {
        // 抛出错误
        return throwError(() => this.lastError);
      }
      // 改变状态为CircuitBreakerState.HALF_OPEN
      this.state = CircuitBreakerState.HALF_OPEN;
    }
    // 返回next.handle()，并使用tap操作符，传入一个函数，当成功时调用handleSuccess，当失败时调用handleError
    return next.handle().pipe(
      tap({
        next: () => this.handleSuccess(),
        error: (err: Error) => this.handleError(err),
      }),
    );
  }

  handleSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= SUCCESS_THRESHOLD) {
        this.successCount = 0;
        this.state = CircuitBreakerState.CLOSED;
      }
    }
  }
  handleError(err: Error) {
    this.failureCount++;
    if (
      // 如果失败次数超过阈值或者当前状态为HALF_OPEN
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CircuitBreakerState.HALF_OPEN
    ) {
      // 将状态设置为OPEN
      this.state = CircuitBreakerState.OPEN;
      // 记录错误
      this.lastError = err;
      // 计算下次尝试时间
      this.nextAttemptTime = Date.now() + OPEN_TO_HALF_OP_WAIT_TIME;
    }
  }
}
