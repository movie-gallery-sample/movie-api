import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialModule } from './modules/credentials/credential.module';
import { MovieModule } from './modules/movies/movie.module';
import { typeOrmEntities } from './imports.entities';
import { importModules } from './imports.modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'P@ssw0rd',
      database: 'movie_gallery',
      entities: typeOrmEntities,
      synchronize: true,
    }),
    ...importModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
