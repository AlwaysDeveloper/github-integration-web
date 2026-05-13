import { config } from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';

config({path: path.join(path.resolve(), 'apps/backend', '.env')})

export default new DataSource({
  type: 'mysql',

  host: process.env.DATABSE_HOST,
  port: Number(process.env.DATABASE_PORT),

  username: process.env.DATABSE_USERNAME,
  password: process.env.DATABSE_PASSWORD,
  database: process.env.DB_NAME,

  entities: ['apps/backend/src/app/database/entities/*.entity.ts'],
  migrations: ['apps/backend/src/app/database/migrations/*.ts'],

  synchronize: false,
});