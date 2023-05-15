import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
//import * as connectRedis from 'connect-redis';
//import { createClient } from 'redis';

export const sessionOptions = (app: INestApplication) => {
  const config = app.get(ConfigService);

  //redis connection logic
  // const RedisStore = connectRedis(session);
  // const redisClient = createClient({
  //   legacyMode: true,
  //   url: config.getOrThrow('REDIS_URL'),
  // });

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      name: '_redisSessionId',
      secret: config.getOrThrow('SESSION_TOKEN_SECRET'),
      //store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        secure: false,
        sameSite: true,
        httpOnly: true, // if true, prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 30, //session age in millisec // 30 mins
      },
    }),
  );

  // await redisClient.connect().catch((error) => {
  //   throw error;
  // });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
};
