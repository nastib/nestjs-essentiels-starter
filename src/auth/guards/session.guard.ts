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

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // if public route bypass authorization
    const isPublicRoute = this.reflector.getAllAndOverride<string>(
      'isPublicRoute',
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) return true;

    //Session guard logic
    const req = context.switchToHttp().getRequest() as Request;
    const session = req.session as UserSession;
    if (!session.user) throw new UnauthorizedException('Session not provided');
    return true;
  }
}
