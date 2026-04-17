"use server";

import { signIn } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function authenticate(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  let redirectTo = "/kasir";

  try {
     // Check role for redirect destination
     const userRecords = await db.select().from(users).where(eq(users.email, email));
     if (userRecords[0]?.role === "ADMIN") {
       redirectTo = "/admin";
     }
  } catch (error) {
     console.error("Auth action: DB check failed", error);
  }

  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false, // Handle redirect manually to avoid issues in some environments
    });
  } catch (error: any) {
    if (error.type === "CredentialsSignin" || error.message?.includes("CredentialsSignin")) {
      return { error: "InvalidCredentials" };
    }
    return { error: "Something went wrong" };
  }

  // If we reach here, signIn didn't throw (meaning redirect: false was respected or it worked)
  // However, with redirect: false, we must redirect manually
  redirect(redirectTo);
}
