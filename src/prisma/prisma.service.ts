import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.getOrThrow('DATABASE_URL'),
        },
      },
      //log: ['info', 'query'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async cleanDb() {
    await this.$transaction([
      this.expense.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
