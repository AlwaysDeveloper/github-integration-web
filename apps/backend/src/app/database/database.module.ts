import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}