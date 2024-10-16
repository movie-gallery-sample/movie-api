import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './validators/custom-validation.pipe';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { swaggerConfig } from './configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  swaggerConfig(app);
  await app.listen(3000);
}
bootstrap();
