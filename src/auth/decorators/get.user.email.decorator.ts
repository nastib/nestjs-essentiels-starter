import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserSession } from '../types';

// Handler param decorator
export const GetUserEmail = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest() as Request;
    const session = req.session as UserSession;
    return session.user?.email;
  },
);
