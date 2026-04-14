import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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
          
          // In production, use bcrypt.compare here
          if (dbUser && credentials.password === dbUser.passwordHash) {
             return {
               id: dbUser.id,
               name: dbUser.name || "Real User",
               email: dbUser.email,
               tenantId: dbUser.tenantId,
               role: dbUser.role
             } as any;
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
            tenantId: "11111111-1111-1111-1111-111111111111", // mock tenant logic
            role: "ADMIN"
          } as any; // Cast as any because we extend the user object
        }
        
        if (credentials?.email === "kasir@example.com" && credentials?.password === "kasir") {
            return {
              id: "2",
              name: "Mock Kasir",
              email: "kasir@example.com",
              tenantId: "11111111-1111-1111-1111-111111111111", // mock tenant logic
              role: "CASHIER"
            } as any;
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
});
