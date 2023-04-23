import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      name: 'session',
      secret: config.getOrThrow('SESSION_TOKEN_SECRET'),
      cookie: { secure: false, sameSite: true, maxAge: 60000 * 5 },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(await config.getOrThrow('PORT'));
  logger.log(
    `Application listening at ${await config.getOrThrow(
      'HOST',
    )}:${await config.getOrThrow('PORT')}`,
  );
}
bootstrap();
