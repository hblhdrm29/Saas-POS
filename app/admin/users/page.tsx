import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import { UserPlus } from "lucide-react";
import StaffList from "./_components/StaffList";

export default async function UsersPage() {
    const session = await auth();
    const currentUser = session?.user as any;

    const staffList = await db
        .select()
        .from(users)
        .where(eq(users.tenantId, currentUser.tenantId))
        .orderBy(desc(users.createdAt));

    return (
        <div className="space-y-4 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
                    <p className="text-slate-400 text-[11px] font-medium leading-none mt-1">Kelola akses dan perizinan tim Anda</p>
                </div>
            </div>

            <StaffList initialStaff={staffList} />
        </div>
    );
}
