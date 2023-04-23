import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { GetUserId } from 'src/auth';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { PaginateDto } from '../common/dto';
import { log } from 'console';
import { UserSessionData } from 'src/auth/types';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  getAllUserExpenses(
    @GetUserId() userId: number,
    @Query() paginate: PaginateDto,
    @Session() session: Record<string, UserSessionData>,
  ) {
    log(session.user);
    return this.expenseService.getAllUserExpenses(userId, paginate);
  }

  @Get(':id')
  getUserExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
  ) {
    return this.expenseService.getUserExpenseById(userId, expenseId);
  }

  @Post()
  createUserExpense(
    @GetUserId() userId: number,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expenseService.createUserExpense(userId, dto);
  }

  @Patch(':id')
  updateUserExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expenseService.updateUserExpenseById(userId, expenseId, dto);
  }

  @Delete(':id')
  deletedUserExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
  ) {
    log(userId, expenseId);
    return this.expenseService.deleteUserExpenseById(userId, expenseId);
  }
}
