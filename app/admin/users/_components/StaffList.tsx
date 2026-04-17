"use client";

import { useState } from "react";
import { Mail, Shield, Calendar, MoreVertical, BadgeCheck, Search, Users, UserPlus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import StaffForm from "./StaffForm";
import { deleteStaff } from "@/app/actions/staff";

interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
}

export default function StaffList({ initialStaff }: { initialStaff: User[] }) {
    const [activeTab, setActiveTab] = useState<'ALL' | 'ADMIN' | 'CASHIER'>('ALL');
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const filteredStaff = initialStaff.filter((staff) => {
        const matchesTab = activeTab === 'ALL' || staff.role === activeTab;
        const matchesSearch = staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        setDeleteError("");
        try {
            const res = await deleteStaff({ id: deletingId });
            if (res.success) {
                setDeletingId(null);
            } else {
                setDeleteError(res.error || "Gagal menghapus staff.");
            }
        } catch (err: any) {
            setDeleteError(err.message || "Terjadi kesalahan sistem.");
        } finally {
            setIsDeleting(false);
        }
    };

    const counts = {
        ALL: initialStaff.length,
        ADMIN: initialStaff.filter(s => s.role === 'ADMIN').length,
        CASHIER: initialStaff.filter(s => s.role === 'CASHIER').length,
    };

    return (
        <div className="space-y-4">
            {/* Tabs & Search Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-1 p-0.5 bg-slate-50/50 rounded-xl w-full lg:w-auto">
                    {[
                        { id: 'ALL', label: 'Staff', icon: Users },
                        { id: 'ADMIN', label: 'Admin', icon: Shield },
                        { id: 'CASHIER', label: 'Kasir', icon: BadgeCheck },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span>{tab.label}</span>
                            <span className={`px-1 rounded-md text-[9px] ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                {counts[tab.id as keyof typeof counts]}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-48 px-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold outline-none focus:bg-white focus:border-slate-100 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 pr-1">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#0066FF] text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95 whitespace-nowrap"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Tambah Staff</span>
                    </button>
                </div>
            </div>

            {showForm && <StaffForm onClose={() => setShowForm(false)} />}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-100/80">
                            <th className="px-6 py-4 w-12 font-medium text-center">#</th>
                            <th className="px-4 py-4 font-medium">Name</th>
                            <th className="px-4 py-4 font-medium">Email</th>
                            <th className="px-4 py-4 font-medium text-center">Position</th>
                            <th className="px-4 py-4 font-medium text-center">Join Date</th>
                            <th className="px-6 py-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="w-5 h-5 text-slate-200" />
                                        <p className="text-[11px] font-bold text-slate-300">No staff found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map((staff, index) => (
                                <tr key={staff.id} className="hover:bg-slate-50/20 transition-all group">
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[11px] font-medium text-slate-300 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[13px] font-semibold text-slate-800 tracking-tight">{staff.name}</span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500 tabular-nums text-[12px]">
                                        {staff.email}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`text-[11px] font-bold tracking-tight ${staff.role === 'ADMIN' ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {staff.role === 'ADMIN' ? 'Administrator' : 'Kasir'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                                            {new Date(staff.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setDeletingId(staff.id)}
                                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Hapus Staff"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            
                            <div>
                                <h4 className="text-[15px] font-bold text-slate-900">Hapus Staff?</h4>
                                <p className="text-[11px] text-slate-500 mt-1 px-2">Data staff yang dihapus tidak dapat dikembalikan lagi.</p>
                            </div>

                            {deleteError && (
                                <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                                    {deleteError}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setDeletingId(null);
                                        setDeleteError("");
                                    }}
                                    disabled={isDeleting}
                                    className="py-2.5 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="py-2.5 rounded-xl bg-red-500 text-white text-[11px] font-bold hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ya, Hapus"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
