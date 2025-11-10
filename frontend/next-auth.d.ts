import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string;
    role?: string;
  }
}

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    accessToken?: string;
    role?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user']; 

    accessToken?: string;
  }
}