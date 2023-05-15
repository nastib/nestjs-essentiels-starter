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

    // const userRoles = dto.roles.map((role) => {
    //   return {
    //     role: {
    //       connectOrCreate: {
    //         where: {
    //           name: role,
    //         },
    //         create: {
    //           name: role,
    //         },
    //       },
    //     },
    //   };
    // });

    const userRoles = dto.roles.map((role) => {
      return {
        where: {
          name: role,
        },
        create: {
          name: role,
        },
      };
    });

    //store the user in the database
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...user } = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hashPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        roles: {
          connectOrCreate: userRoles,
        },
      },
      include: {
        //roles: { include: { role: { select: { name: true } } } },
        roles: { select: { name: true } },
      },
    });

    return { ...user };
  }

  async signin(email: string, password: string) {
    //Found user
    const { hash, ...userFound } = await this.prisma.user.findFirst({
      //const userFound = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        //roles: { include: { role: { select: { name: true } } } },
        roles: { select: { name: true } },
      },
    });

    if (!userFound) throw new ForbiddenException('Credentials incorrect');

    //hash and verify the password
    const passwordMatches = await argon.verify(hash, password);
    if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');
    return { ...userFound };
  }
}
