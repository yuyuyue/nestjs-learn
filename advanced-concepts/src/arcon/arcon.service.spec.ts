import { Test, TestingModule } from '@nestjs/testing';
import { ArconService } from './arcon.service';

describe('ArconService', () => {
  let service: ArconService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArconService],
    }).compile();

    service = module.get<ArconService>(ArconService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
