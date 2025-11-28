// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      roles?: string[];
      phoneNumber?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    roles?: string[];
    phoneNumber?: string;
  }
}
