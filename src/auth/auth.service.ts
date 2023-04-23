import { AuthSignupDto } from './dto';
import { PrismaService } from 'src/prisma';
import { Injectable, ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: AuthSignupDto) {
    //Check if user exists throw exception
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (userExists) throw new ForbiddenException('Credentials incorrect');

    //hash the password
    const hashPassword = await argon.hash(dto.password);

    //store the user in the database
    const { hash, ...user } = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hashPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    return { ...user };
  }

  async signin(email: string, password: string) {
    //Found user
    const { hash, ...userFound } = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!userFound) throw new ForbiddenException('Credentials incorrect');

    //hash and verify the password
    const passwordMatches = await argon.verify(hash, password);
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');

    return { ...userFound };
  }
}
