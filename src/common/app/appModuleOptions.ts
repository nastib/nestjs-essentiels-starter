import { AppController } from 'src/app.controller';
import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminGuard, AuthModule, SessionGuard } from 'src/auth';
import { ExpenseModule } from 'src/expense';
import { PrismaModule } from 'src/prisma';
import { RedisCacheModule } from 'src/redis';
import { SchedulerModule } from 'src/scheduler';
import { UserModule } from 'src/user';

export const appModuleOptions = {
  controllers: [AppController],
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    UserModule,
    ExpenseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RedisCacheModule,
    ScheduleModule.forRoot(),
    SchedulerModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
};
