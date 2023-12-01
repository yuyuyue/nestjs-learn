import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeeModule } from './coffee/coffee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { databaseOptions } from 'config/orm.config';
import { CommonModule } from './common/common.module';
@Module({
  imports: [
    CoffeeModule,
    // TypeOrmModule.forRoot(databaseOptions),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: true, // 自动与数据库同步,会建表，开发中可以使用，生产需要注释掉
        entities: ['dist/**/*.entity.js'], // 实体位置, 必须要有
        migrations: ['dist/migrations/*.js'], // 迁移记录
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig], // 引用配置文件
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      }),
    }),
    CoffeRatingModule,
    CommonModule,
    // DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
