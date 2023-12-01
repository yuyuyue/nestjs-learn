import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, Reflector, MetadataScanner } from '@nestjs/core';
import { INTERVAL_HOST_KEY } from '../decorators/interval-host.decorators';
import { INTERVAL_KEY } from '../decorators/interval.decorators';

@Injectable()
export class IntervalScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private intervalRef: NodeJS.Timer[] = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    const provides = this.discoveryService.getProviders();
    provides.forEach((wrapper) => {
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);
      if (!instance || !prototype) {
        return;
      }
      const intervalHosts =
        this.reflector.get(INTERVAL_HOST_KEY, instance.constructor) ?? false;
      if (!intervalHosts) {
        return;
      }
      const methodKey = this.metadataScanner.getAllMethodNames(prototype);
      methodKey.forEach((methodKey) => {
        const method = instance[methodKey];
        const ms = this.reflector.get(INTERVAL_KEY, method);
        if (ms === undefined) {
          return;
        }
        // const interval = setInterval(method, ms);
        // this.intervalRef.push(interval);
      });
    });
  }

  onApplicationShutdown(signal?: string) {
    this.intervalRef.forEach((interval) => clearInterval(interval));
  }
}
