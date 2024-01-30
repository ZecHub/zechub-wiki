import { NextAuthOptions } from "next-auth";
import { NEXTAUTH_SECRET, GITHUB_APP_CLIENT_ID, GITHUB_APP_CLIENT_SECRET } from "./config";
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
