import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

import { sessionOptions } from 'src/common/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  sessionOptions(app);

  await app.listen(await config.getOrThrow('BACKEND_PORT'));
  logger.log(
    `Application listening at ${await config.getOrThrow(
      'BACKEND_HOST',
    )}:${await config.getOrThrow('BACKEND_PORT')}`,
  );
}

bootstrap();
