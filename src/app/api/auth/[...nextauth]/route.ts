// /app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "@/lib/users";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = users.find(
                    (u) =>
                        u.email === credentials.email &&
                        u.password === credentials.password
                );

                if (user) {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                }

                throw new Error("Invalid email or password");
            },
        }),
    ],

    session: { strategy: "jwt" },

    pages: {
        signIn: "/auth/login",
        error: "/auth/fallback",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            if (token?.user) session.user = token.user;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
