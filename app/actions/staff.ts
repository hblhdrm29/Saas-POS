"use server";

import { z } from "zod";
import { authAction } from "@/lib/safe-action";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const staffSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    role: z.enum(["ADMIN", "CASHIER"]),
    shift: z.string().optional(),
});

export const createStaff = authAction(staffSchema, async (data, ctx) => {
    // Only admins can create staff
    if (ctx.role !== "ADMIN") {
        throw new Error("Only administrators can add new staff.");
    }

    try {
        // Check if email already exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, data.email));

        if (existingUser) {
            throw new Error("A user with this email already exists.");
        }

        // Insert new user
        // Note: For now we store password as a plain string in passwordHash field per auth.ts requirements
        // In a real production app, we would use bcrypt.hash(data.password, 10) here.
        await db.insert(users).values({
            name: data.name,
            email: data.email,
            passwordHash: data.password,
            role: data.role,
            shift: data.shift,
            tenantId: ctx.tenantId,
        });

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        throw new Error(error.message || "Failed to create staff member.");
    }
});

export const deleteStaff = authAction(z.object({ id: z.string() }), async (data, ctx) => {
    if (ctx.role !== "ADMIN") {
        throw new Error("Only administrators can delete staff.");
    }

    // Safety guard 1: Don't delete self
    if (data.id === ctx.userId) {
        throw new Error("You cannot delete your own account while logged in.");
    }

    try {
        // Safety guard 2: Don't delete the last admin
        const admins = await db
            .select()
            .from(users)
            .where(eq(users.role, 'ADMIN'));

        const targetUser = await db
            .select()
            .from(users)
            .where(eq(users.id, data.id));

        if (targetUser[0]?.role === 'ADMIN' && admins.length <= 1) {
            throw new Error("Cannot delete the last administrator.");
        }

        await db.delete(users).where(eq(users.id, data.id));

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete staff member.");
    }
});
