import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RedisClientType } from 'redis';
import * as request from 'supertest';

import { PrismaService } from 'src/prisma';
import { AuthSigninDto, AuthSignupDto } from '@app/src/auth';
import { CreateExpenseDto, UpdateExpenseDto } from '@app/src/expense/dto';
import { expenseStub1, expenseStub2 } from 'src/expense/stub';
import { sessionOptions, appModuleOptions } from '../src/common/app';

describe('App E2E', () => {
  let app: INestApplication;
  let cookie = '';

  beforeAll(async () => {
    const module = await Test.createTestingModule(appModuleOptions).compile();

    app = module.createNestApplication();

    sessionOptions(app);

    const prismaService = app.get(PrismaService);
    prismaService.cleanDb();

    await app.init();
  });

  afterAll(async () => {
    const cache = app.get(CACHE_MANAGER);
    const cacheClient: RedisClientType = cache.store.getClient();
    await cacheClient.quit();
    app.close();
  });

  describe('AppModule', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });

  describe('Auth', () => {
    describe('signup', () => {
      it('should signup', () => {
        const dto: AuthSignupDto = {
          email: 'wilnas@gmail.com',
          password: '12345',
          firstName: 'wil',
          lastName: 'Nas',
          roles: ['User', 'Admin'],
        };
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect('Set-Cookie', /_redisSessionId/)
          .expect(201);
        // .expect((res) => {
        //   console.log('res', res.text);
        // });
      });
    });

    describe('signin', () => {
      it('should signin', () => {
        const dto: AuthSigninDto = {
          email: 'wilnas@gmail.com',
          password: '12345',
        };
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect('Set-Cookie', /_redisSessionId/)
          .expect(200)
          .expect(({ headers }) => {
            cookie = headers?.['set-cookie'];
          });
        // .expect((res) => {
        //   console.log('res', { res });
        // });
      });
    });
  });

  describe('user', () => {
    describe('get me', () => {
      it('should get me', () => {
        return request(app.getHttpServer())
          .get('/users/me')
          .set('Cookie', cookie)
          .expect(200);
      });
    });

    describe('get all users', () => {
      it('should get users', () => {
        return request(app.getHttpServer())
          .get('/users')
          .set('Cookie', cookie)
          .expect(200);
      });
    });
  });

  describe('Expense', () => {
    let expenseId: number;

    it('should create expenses', async () => {
      const expense1: CreateExpenseDto = { ...expenseStub1() };
      const expense2: CreateExpenseDto = { ...expenseStub2() };

      await request(app.getHttpServer())
        .post('/expenses')
        .set('Cookie', cookie)
        .send(expense1)
        .expect(201);

      await request(app.getHttpServer())
        .post('/expenses')
        .set('Cookie', cookie)
        .send(expense2)
        .expect(201);
    });

    it('should get all expenses', () => {
      return request(app.getHttpServer())
        .get('/expenses')
        .set('Cookie', cookie)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              data: expect.any(Array),
              count: 2,
              hasMore: false,
            }),
          );

          expenseId = body.data[0].id;
        });
    });

    it('should get expense by id', async () => {
      await request(app.getHttpServer())
        .get(`/expenses/${0}`)
        .set('Cookie', cookie)
        .expect(404)
        .expect(({ body }) => {
          expect(body.message).toEqual(
            'Resource does not exist or unauthorized',
          );
        });

      await request(app.getHttpServer())
        .get(`/expenses/${expenseId}`)
        .set('Cookie', cookie)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toBeTruthy();
        });
    });

    it('should edit expense by id', () => {
      const dto: UpdateExpenseDto = {
        description: 'Updated description',
      };
      return request(app.getHttpServer())
        .patch(`/expenses/${expenseId}`)
        .set('Cookie', cookie)
        .send(dto)
        .expect(200)
        .expect(({ body }) => {
          expect(body.description).toEqual(dto.description);
        });
    });

    it('should delete expense by id', async () => {
      await request(app.getHttpServer())
        .delete(`/expenses/${expenseId}`)
        .set('Cookie', cookie)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/expenses/${expenseId}`)
        .set('Cookie', cookie)
        .expect(404);
    });
  });
});
