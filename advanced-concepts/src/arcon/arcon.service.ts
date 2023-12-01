import { IntervalHost } from 'src/scheduler/decorators/interval-host.decorators';
import { Interval } from 'src/scheduler/decorators/interval.decorators';
@IntervalHost
export class ArconService {
  @Interval(1000)
  interval() {
    console.log('This will be logged every second');
  }
}
