import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialEntity } from './modules/credentials/credential.entity';
import { CredentialModule } from './modules/credentials/credential.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'P@ssw0rd',
      database: 'movie_gallery',
      entities: [CredentialEntity,],
      synchronize: true,
    }),
    CredentialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
