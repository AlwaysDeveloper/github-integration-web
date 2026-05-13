import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABSE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABSE_USERNAME,
  password: process.env.DATABSE_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: false,
  logging: true,
};
