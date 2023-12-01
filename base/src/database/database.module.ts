import { DynamicModule, Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  exports: [DatabaseModule],
})
export class DatabaseModule {
  static register(options: DataSourceOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: new DataSource(options),
        },
      ],
    };
  }
}
