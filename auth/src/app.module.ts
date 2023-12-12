import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { CoffeesModule } from './coffees/coffees.module';
import { RedisModule } from './common/modules/redis/redis.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      entities: ['dist/**/*.entity.js'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    IamModule,
    CoffeesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
