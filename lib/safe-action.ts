import { auth } from "@/auth";
import { z } from "zod";

export type ActionState<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface SessionUser {
  id?: string;
  sub?: string;
  tenantId?: string;
  role?: string;
}

export function authAction<TInput, TOutput>(
  schema: z.ZodType<TInput>,
  handler: (input: TInput, ctx: { userId: string; tenantId: string; role: string }) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    try {
      const session = await auth();
      if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
      }

      // Extract our custom JWT session properties
      const user = session.user as SessionUser;
      const tenantId = user.tenantId;
      const role = user.role || 'CASHIER';
      const userId = user.id || user.sub;

      if (!tenantId || !userId) {
        return { success: false, error: "Missing user session context" };
      }

      const parsed = schema.safeParse(input);
      if (!parsed.success) {
        return { success: false, error: "Invalid input data: " + parsed.error.message };
      }

      const result = await handler(parsed.data, { userId, tenantId, role });
      return { success: true, data: result };
    } catch (err) {
      console.error("Action error:", err);
      const error = err as Error;
      return { success: false, error: error.message || "Internal server error" };
    }
  };
}
