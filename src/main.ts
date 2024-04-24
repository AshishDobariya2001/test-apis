import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ENDPOINT_PREFIX, PORT } from './framework/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(ENDPOINT_PREFIX);

  app.enableCors();
  initializeSwagger(app);

  await app.listen(PORT || 3000);
  Logger.debug(`🚀  Server is listening on port ${PORT}`);
}

function initializeSwagger(app) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Amagi CONNECT System API')
    .setDescription('Amagi CONNECT System API')
    .setVersion('v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`);
  throw e;
});
