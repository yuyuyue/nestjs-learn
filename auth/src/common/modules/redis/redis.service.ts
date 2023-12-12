import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Redis } from 'ioredis';
import redisConfig from 'src/common/config/redis.config';

@Injectable()
export class RedisService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  @Inject(redisConfig.KEY)
  private readonly redisConfig: ConfigType<typeof redisConfig>;

  public redisClient: Redis;

  onApplicationBootstrap() {
    this.redisClient = new Redis(this.redisConfig);
  }

  onApplicationShutdown(signal?: string) {
    return this.redisClient.quit();
  }
}
