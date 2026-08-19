import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL =
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.RENDER_EXTERNAL_HOSTNAME
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
      : "http://localhost:3000");
}

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.DATABASE_URL,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });
        if (!admin) return null;

        const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
        if (!valid) return null;

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name ?? "Администратор",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = (token.email as string) ?? session.user.email;
      }
      return session;
    },
  },
};
