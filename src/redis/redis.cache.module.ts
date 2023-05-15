import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

import { redisOptions } from './utils';

@Global()
@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: redisOptions.host,
            port: redisOptions.port,
          },
          ttl: 60,
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class RedisCacheModule {}
