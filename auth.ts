import NextAuth, { DefaultSession, User } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// 1. Extend types for NextAuth
declare module "next-auth" {
  interface User {
    tenantId?: string;
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      tenantId?: string;
      role?: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tenantId?: string;
    role?: string;
  }
}

interface CustomUser extends User {
  tenantId: string;
  role: string;
}

// We use basic credentials auth for the POS, mapping to our custom users schema.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Check real DB
        try {
          const userRecords = await db.select().from(users).where(eq(users.email, credentials.email as string));
          const dbUser = userRecords[0];
          
          if (dbUser && credentials.password === dbUser.passwordHash) {
             return {
               id: dbUser.id,
               name: dbUser.name || "Real User",
               email: dbUser.email,
               tenantId: dbUser.tenantId,
               role: dbUser.role
             } as CustomUser;
          }
        } catch (dbErr) {
          console.error("DB Lookup error", dbErr);
        }

        // 2. Fallback to mock for testing
        if (credentials?.email === "admin@example.com" && credentials?.password === "admin") {
          return {
            id: "1",
            name: "Mock Admin",
            email: "admin@example.com",
            tenantId: "11111111-1111-1111-1111-111111111111", 
            role: "ADMIN"
          } as CustomUser;
        }
        
        if (credentials?.email === "kasir@example.com" && credentials?.password === "kasir") {
            return {
              id: "2",
              name: "Mock Kasir",
              email: "kasir@example.com",
              tenantId: "11111111-1111-1111-1111-111111111111",
              role: "CASHIER"
            } as CustomUser;
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = (user as CustomUser).tenantId;
        token.role = (user as CustomUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.tenantId = token.tenantId as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
});
