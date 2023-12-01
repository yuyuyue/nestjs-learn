import { WithUuid } from 'src/common/mixins/with-uuid.ts/with-uuid.ts';

export class Coffee {
  constructor(public name: string) {}
}

const CoffeeWithUuidCls = WithUuid(Coffee);

const coffee = new CoffeeWithUuidCls('Coffee');
