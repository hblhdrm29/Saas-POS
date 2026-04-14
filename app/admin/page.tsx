import { auth } from "@/auth";

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {session?.user?.name}</h1>
        <p className="text-slate-500">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-2">
          <span className="text-slate-500 font-medium text-sm">Today's Revenue</span>
          <span className="text-3xl font-bold text-slate-900">Rp 0</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-2">
          <span className="text-slate-500 font-medium text-sm">Transactions</span>
          <span className="text-3xl font-bold text-slate-900">0</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-2">
          <span className="text-slate-500 font-medium text-sm">Active Products</span>
          <span className="text-3xl font-bold text-slate-900">0</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm h-96">
        <h3 className="font-semibold text-lg border-b pb-4 mb-4">Recent Transactions</h3>
        <div className="flex items-center justify-center h-48 text-slate-400">
          No recent transactions found.
        </div>
      </div>
    </div>
  );
}
