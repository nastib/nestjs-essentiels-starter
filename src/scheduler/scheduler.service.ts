import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { Expense } from '@prisma/client';
import { PrismaService } from '../prisma';

@Injectable()
export class SchedulerService {
  private logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async computeBalances() {
    this.logger.debug('computeBalance running ....');
    const users = await this.prisma.user.findMany({
      include: {
        expenses: true,
      },
    });

    for (const user of users) {
      this.logger.log(`computeBalances ran for ${user.id}`);
      const sum = this.getExpensesSum(user.expenses);
      if (user.initialBalance <= sum) continue;

      await this.prisma.user
        .update({
          where: {
            id: user.id,
          },
          data: {
            currentBalance: user.initialBalance - sum,
          },
        })
        .catch((error) => this.logger.error(error));
    }
  }

  getExpensesSum(expenses: Expense[]) {
    return expenses.reduce((prev: number, curr: Expense) => {
      return prev + parseInt(curr.amount);
    }, 0);
  }

  // @Interval(2000)
  // handleInterval() {}

  // @Timeout(5000)
  // handleTimeout() {}
}
