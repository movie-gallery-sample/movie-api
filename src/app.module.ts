import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmEntities } from './imports.entities';
import { importModules } from './imports.modules';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_TITLE,
      entities: typeOrmEntities,
      synchronize: true,
    }),
    ...importModules,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
