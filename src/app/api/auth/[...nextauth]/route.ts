import NextAuth from 'next-auth';

import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} from '@/config';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  callbacks: {},
  providers: [
    GithubProvider({
      clientId: GITHUB_APP_CLIENT_ID,
      clientSecret: GITHUB_APP_CLIENT_SECRET,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
