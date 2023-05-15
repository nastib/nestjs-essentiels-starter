import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from '../prisma';

@Module({
  providers: [SchedulerService, PrismaService],
})
export class SchedulerModule {}
