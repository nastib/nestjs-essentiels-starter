import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

import { UserSession } from '../types';
import { Role } from '../enums';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // if not admin route bypass authorization
    const isAdminRoute = this.reflector.getAllAndOverride<string>(
      'isAdminRoute',
      [context.getHandler(), context.getClass()],
    );

    if (!isAdminRoute) return true;

    //Admin guard logic
    const req = context.switchToHttp().getRequest() as Request;
    const session = req.session as UserSession;

    if (session.user.roles.some((role) => role === Role.ADMIN)) {
      return true;
    }
    throw new UnauthorizedException('Reserved for admins');
  }
}
