import { Session } from 'express-session';
import { Request } from 'express';
//import { UsersOnRoles } from 'prisma/generated/prisma-client-js';

export interface UserSessionData {
  userId: number;
  email: string;
  roles: string[];
}

export type UserSession = Session & Record<'user', UserSessionData>;

export type UserRequest = Request & Record<'user', UserSessionData>;

// export type UserRoles = UsersOnRoles & {
//   role: {
//     name: string;
//   };
// };

export type UserRoles = {
  name: string;
};
