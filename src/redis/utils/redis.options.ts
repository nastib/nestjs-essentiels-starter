import { ConfigService } from '@nestjs/config';
const config = new ConfigService();
export const redisOptions = {
  host: config.get('REDIS_HOST'),
  port: config.get('REDIS_PORT'),
};
