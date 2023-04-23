import { Role } from './src/auth/enums/Role';

declare module 'express-session' {
  interface UserSession1 {
    user: {
      userId: number;
      email: string;
      roles: [Role];
    };
  }
}

declare module 'express' {
  interface UserRequest1 {
    sessionID: string;
    user: {
      userId: number;
      email: string;
      roles: [Role];
    };
  }
}
