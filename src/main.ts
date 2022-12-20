import { HttpException, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { join } from 'path';
import { AppModule } from './app.module';
const signale = require('signale');

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Setup Swagger
  const SwaggerConfig = new DocumentBuilder()
    .setTitle("GS BE")
    .setDescription("GS Boilerplate Using Nest JS")
    .setVersion('0.1')
    .addTag("boilerplate")
    .build();
  const SwaggerDocument = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('/swagger/api', app, SwaggerDocument);


  // Setup View
  app.useStaticAssets(join(__dirname, "..", 'views/public'));
  app.setBaseViewsDir(join(__dirname, "..", 'views/pages'));
  app.setViewEngine('hbs');

  await app.listen(port, () => {
    signale.success(`Server Ready at http://localhost:${port}`);
  });
}

bootstrap();
