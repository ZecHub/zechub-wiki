import { NextAuthOptions } from "next-auth";
import { NEXTAUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "./config";
import GithubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
  interface User {
    
  }
}
export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  callbacks: {
    session({session, token, user}){
      return {
        ...session,
        user:{
          ...session.user
        }
      }
    }
  },
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
};
