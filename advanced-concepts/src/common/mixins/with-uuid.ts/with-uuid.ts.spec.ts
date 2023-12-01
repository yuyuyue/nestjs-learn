import { WithUuidTs } from './with-uuid.ts';

describe('WithUuidTs', () => {
  it('should be defined', () => {
    expect(new WithUuidTs()).toBeDefined();
  });
});
