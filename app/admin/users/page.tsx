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
                <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0066FF] text-white rounded-xl text-[12px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95">
                    <UserPlus className="w-4 h-4" />
                    <span>Tambah Staff</span>
                </button>
            </div>

            <StaffList initialStaff={staffList} />
        </div>
    );
}
