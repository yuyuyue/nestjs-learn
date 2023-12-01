import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  synchronize: true, // 自动与数据库同步,会建表，开发中可以使用，生产需要注释掉
  entities: ['dist/**/*.entity.js'], // 实体位置
  migrations: ['dist/migrations/*.js'], // 迁移记录
};

const dataSource = new DataSource(databaseOptions);

export default dataSource;
