import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(email: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...user } = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    });
  }
}
