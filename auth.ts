import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const ok = await bcrypt.compare(password, user.password);
          if (!ok) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? "",
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token?.id ? String(token.id) : "",
        };
      }
      return session;
    },
  },
});