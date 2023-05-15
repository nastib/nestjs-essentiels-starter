import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { SchedulerService } from '../scheduler.service';
import { PrismaService } from '../../prisma';
import { UsersWithExpensesStub } from '../../user/stub';

jest.mock('../../prisma/prisma.service.ts');

describe('SchedulerService', () => {
  let service: SchedulerService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [SchedulerService, PrismaService],
    }).compile();

    service = module.get(SchedulerService);
    prisma = module.get(PrismaService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('getExpensesSum', () => {
    describe('when called', () => {
      let result: number;

      beforeEach(() => {
        result = service.getExpensesSum(UsersWithExpensesStub()[0].expenses);
      });

      it('should return sum', () => {
        expect(result).toEqual(70);
      });
    });
  });
});
