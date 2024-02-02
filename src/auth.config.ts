import { NextAuthOptions } from "next-auth";
import { NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "./config";
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  callbacks: {},
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
};
