import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './validators/custom-validation.pipe';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { swaggerConfig } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  swaggerConfig(app);
  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
