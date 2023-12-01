import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeeModule } from 'src/coffee/coffee.module';

@Module({
  imports: [
    CoffeeModule,
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      synchronize: true, // 自动与数据库同步,会建表，开发中可以使用，生产需要注释掉
    }),
  ],
  providers: [CoffeeRatingService],
})
export class CoffeRatingModule {}
