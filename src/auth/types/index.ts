import { Role } from '../enums/Role';
import { Session } from 'express-session';
import { Request } from 'express';

export type UserSessionData = {
  userId: number;
  email: string;
  roles: [Role];
};

export type UserSession = Session & Record<'user', UserSessionData>;

export type UserRequest = Request & Record<'user', UserSessionData>;
