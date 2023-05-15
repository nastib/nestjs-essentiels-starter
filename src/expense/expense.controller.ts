import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { GetUserId } from 'src/auth';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';
import { PaginateDto } from 'src/common/dto';
import { UserSessionData } from 'src/auth/types';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    @Inject(CACHE_MANAGER) private cacheService: Cache, // using the cache service (by injecting in the constructor)
  ) {}

  /**
   * @param userId
   * @param paginate
   * @param session
   * @returns
   * @description
   * '@UseInterceptors' decorator only works on Get requests, and is not currently supported in GraphQL
   *  resolvers. So basically, you can just use the '@CacheInterceptor' decorator on any REST Get endpoint.
   */
  @Get()
  //@UseInterceptors(CacheInterceptor) // Automatically cache the response for this endpoint
  //@CacheKey('all-user-expenses')
  //@CacheTTL(30) // override TTL to 30 seconds
  async getAllUserExpenses(
    @GetUserId() userId: number,
    @Query() paginate: PaginateDto,
    @Session() session: Record<string, UserSessionData>,
  ) {
    const cacheKey = 'all-'.concat(userId.toString()).concat('-expenses');
    const cachedData = await this.cacheService.get(cacheKey);

    // check if data is in cache:
    if (cachedData) {
      console.log(`Getting data from cache!`);
      return cachedData;
    }

    // if not, call API and set the cache:
    const data = await this.expenseService.getAllUserExpenses(userId, paginate);
    console.log(`Getting data from database!`);

    await this.cacheService.set(cacheKey, { data });

    return data;
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
  @HttpCode(HttpStatus.NO_CONTENT)
  deletedUserExpenseById(
    @GetUserId() userId: number,
    @Param('id') expenseId: number,
  ) {
    return this.expenseService.deleteUserExpenseById(userId, expenseId);
  }
}
