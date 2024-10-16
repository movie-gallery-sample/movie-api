import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app: INestApplication<any>) => {
  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Movie gallery API')
      .setDescription('This will help you to see whole APIs of movie gallery')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );
  return SwaggerModule.setup('swagger', app, doc, {
    swaggerOptions: {
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1, // Disable the models section (schemas)
    },
  });
};
