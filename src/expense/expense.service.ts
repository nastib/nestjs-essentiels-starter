import { log } from 'console';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Expense } from 'prisma/generated/prisma-client-js';
import { PrismaService } from 'src/prisma';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { PaginateDto, PaginateResultDto } from 'src/common/dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUserExpenses(
    userId: number,
    paginate: PaginateDto,
  ): Promise<PaginateResultDto> {
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
      },
      take: paginate.limit,
      skip: paginate.offset,
    });

    const count = await this.prisma.expense.count({
      where: {
        userId,
      },
    });

    return {
      data: expenses,
      count,
      hasMore: count > paginate.limit + paginate.offset,
    };
  }

  async getUserExpenseById(
    userId: number,
    expenseId: number,
  ): Promise<Expense> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        AND: [
          {
            id: {
              equals: expenseId,
            },
          },
          {
            userId: {
              equals: userId,
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!expense)
      throw new NotFoundException('Resource does not exist or unauthorized');
    delete expense.userId;
    return expense;
  }

  async createUserExpense(
    userId: number,
    dto: CreateExpenseDto,
  ): Promise<Expense> {
    const newExpense = await this.prisma.expense.create({
      data: {
        ...dto,
        userId,
      },
    });
    return newExpense;
  }

  async updateUserExpenseById(
    userId: number,
    expenseId: number,
    dto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
      },
    });
    if (!expense) throw new NotFoundException('Resource does not exist');
    if (expense.userId !== userId)
      throw new ForbiddenException('Access to resource unauthorized');

    const updatedExpense = await this.prisma.expense.update({
      where: {
        id: expenseId,
      },
      data: dto,
    });
    return updatedExpense;
  }

  async deleteUserExpenseById(
    userId: number,
    expenseId: number,
  ): Promise<Expense> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
      },
    });
    if (!expense) throw new NotFoundException('Resource does not exist');
    if (expense.userId !== userId)
      throw new ForbiddenException('Access to resource unauthorized');
    log(expense);
    await this.prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    return expense;
  }
}
