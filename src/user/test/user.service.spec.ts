import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma';
import { ConfigModule } from '@nestjs/config';
import { UserStub } from '../stub';

jest.mock('../../prisma/prisma.service.ts');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('getMe()', () => {
    describe('when called', () => {
      let user: any;

      beforeEach(async () => {
        user = await service.getMe('test@gmail.com');
      });

      test('findUnique() should be called', () => {
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
          where: {
            email: UserStub().email,
          },
        });

        expect(prisma.user.findUnique).toHaveReturnedWith(
          Promise.resolve(UserStub()),
        );
      });

      it('should return user', () => {
        const _user = UserStub();
        delete _user.hash;
        expect(user).toMatchObject(_user);
        expect(user.hash).toBeUndefined();
      });
    });
  });
});
