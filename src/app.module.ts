import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule, SessionGuard } from './auth';
import { PrismaModule } from './prisma';
import { UserModule } from './user';
import { ExpenseModule } from './expense';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    UserModule,
    ExpenseModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
})
export class AppModule {}
