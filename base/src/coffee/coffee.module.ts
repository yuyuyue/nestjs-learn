import { Module, Scope } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffee.constant';
import { ConfigModule } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';

class DevConfigService {}
class ProdConfigService {}
class ConfigService {}
@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeeConfig),
  ],
  controllers: [CoffeeController],
  providers: [
    CoffeeService,
    // { provide: COFFEE_BRANDS, useValue: ['aaa', 'vvvv'] },
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: async () => {
    //     const coffeeBrands = await Promise.resolve(['aaa', 'vvv']);
    //     return coffeeBrands;
    //   },
    //   scope: Scope.TRANSIENT,
    // },
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'dev' ? DevConfigService : ProdConfigService,
    },
  ], // 依赖收集
  exports: [CoffeeService], // 导出service
})
export class CoffeeModule {}
