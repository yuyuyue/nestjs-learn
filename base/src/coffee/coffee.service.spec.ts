import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
});

describe('CoffeeService', () => {
  let service: CoffeeService;
  let coffeRepos: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Event),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
    coffeRepos = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('ID exists', () => {
      it('return the coffe objec', async () => {
        const coffeeId = 1;
        const expectCoffee = {};

        coffeRepos.findOneBy.mockReturnValue(expectCoffee);
        const coffee = await service.findOne(coffeeId);
        console.log(coffee, expectCoffee);
        expect(coffee).toEqual(expectCoffee);
      });
    });
    describe('not exists', () => {
      // it('throw NotFoundException', async () => {});
    });
  });
});
