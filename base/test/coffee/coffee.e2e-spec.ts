import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeeModule } from 'src/coffee/coffee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffee/dto/create-coffee.dto';

describe('[Feature Coffess] - /coffess', () => {
  let app: INestApplication;
  const coffee = {
    name: 'coffee',
    brand: 'yes',
    flavors: ['a', 'b'],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeeModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          synchronize: true, // 自动与数据库同步,会建表，开发中可以使用，生产需要注释掉
          autoLoadEntities: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 自动过滤掉非dto的传入参数
        transform: true, // 将dto转换成正确的dto类型, 包括参数比如路径的string2number
        forbidNonWhitelisted: true, // 非白名单的参数抛出错误
        transformOptions: {
          enableImplicitConversion: true, // 参数隐式转换
        },
      }),
    );
    console.log(app);
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffee')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flvors: jasmine.arrayContaining(
            coffee.flavors.map((name) => jasmine.objectContaining({ name })),
          ),
        });
        expect(body).toEqual(expectedCoffee);
      });
  });
  it.todo('Get all [GET] /');
  it.todo('Get one [GET] /:id');

  afterAll(async () => {
    await app?.close();
  });
});
