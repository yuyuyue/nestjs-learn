import { Inject, Injectable } from '@nestjs/common';
import { ApiKeysPayload } from './api-keys.type';
import { randomUUID } from 'crypto';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class ApiKeysService {
  @Inject()
  private readonly hashingService: HashingService;

  async create(id: number): Promise<ApiKeysPayload> {
    const apiKey = this.generateApiKey(id);
    const hashedKey = await this.hashingService.hash(apiKey);
    return {
      apiKey,
      hashedKey,
    };
  }

  async validate(apiKey: string, hashedKeys: string): Promise<boolean> {
    return await this.hashingService.compare(apiKey, hashedKeys);
  }

  extractIdFromApiKey(apiKey: string): string {
    const [id] = Buffer.from(apiKey, 'base64').toString().split(' ');
    return id;
  }

  private generateApiKey(id: number): string {
    const apiKey = `${id} ${randomUUID()}`;
    return Buffer.from(apiKey).toString('base64');
  }
}
