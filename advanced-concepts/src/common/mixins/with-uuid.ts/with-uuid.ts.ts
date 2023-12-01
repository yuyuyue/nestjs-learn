import { Type } from '@nestjs/common';
import { randomUUID } from 'crypto';

export function WithUuid<Tbase extends Type>(Base: Tbase) {
  return class extends Base {
    uuid = randomUUID();

    generateUuid() {
      this.uuid = randomUUID();
    }
  };
}
