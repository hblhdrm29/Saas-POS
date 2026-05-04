import { db } from "@/db";
import { users, shifts } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import StaffList from "./_components/StaffList";

export default async function UsersPage() {
    const session = await auth();
    if (!session?.user?.tenantId) return <div>Unauthorized</div>;
    const tenantId = session.user.tenantId;

    const staffList = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            shift: users.shift,
            createdAt: users.createdAt,
            lastShiftStartTime: shifts.startTime,
            lastShiftEndTime: shifts.endTime,
            lastShiftStatus: shifts.status,
            lastShiftId: shifts.id,
            lastShiftStartingCash: shifts.startingCash,
            lastShiftTotalSalesCash: shifts.totalSalesCash,
            lastShiftNotes: shifts.notes,
        })
        .from(users)
        .leftJoin(shifts, eq(shifts.id, 
            db.select({ id: shifts.id })
              .from(shifts)
              .where(eq(shifts.userId, users.id))
              .orderBy(desc(shifts.startTime))
              .limit(1)
        ))
        .where(eq(users.tenantId, tenantId))
        .orderBy(desc(users.createdAt));

    const serializedStaff = staffList.map(s => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        lastShiftStartTime: s.lastShiftStartTime ? s.lastShiftStartTime.toISOString() : null,
        lastShiftEndTime: s.lastShiftEndTime ? s.lastShiftEndTime.toISOString() : null,
    }));

    return (
        <div className="space-y-4 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manajemen Staff</h1>
                    <p className="text-slate-400 text-[11px] font-medium leading-none mt-1">Kelola akses dan perizinan staff anda</p>
                </div>
            </div>

            <StaffList initialStaff={serializedStaff} />
        </div>
    );
}
