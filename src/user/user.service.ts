import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(email: string) {
    const { hash, ...user } = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
