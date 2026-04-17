"use client";

import { useState } from "react";
import { Mail, Shield, Calendar, MoreVertical, BadgeCheck, Search, Users } from "lucide-react";

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

    const filteredStaff = initialStaff.filter((staff) => {
        const matchesTab = activeTab === 'ALL' || staff.role === activeTab;
        const matchesSearch = staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              staff.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

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

                <div className="relative w-full lg:w-64 px-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                    <input 
                        type="text" 
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold outline-none focus:bg-white focus:border-slate-100 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold tracking-wider border-b border-slate-100/80">
                            <th className="px-6 py-4 w-12 font-medium">#</th>
                            <th className="px-4 py-4 font-medium">Name</th>
                            <th className="px-4 py-4 font-medium">Email</th>
                            <th className="px-4 py-4 font-medium">Position</th>
                            <th className="px-4 py-4 font-medium">Join Date</th>
                            <th className="px-6 py-4 text-right font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center flex flex-col items-center gap-2">
                                    <Search className="w-5 h-5 text-slate-200" />
                                    <p className="text-[11px] font-bold text-slate-300">No staff found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map((staff, index) => (
                                <tr key={staff.id} className="hover:bg-slate-50/20 transition-all group">
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-medium text-slate-300 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[13px] font-semibold text-slate-800 tracking-tight">{staff.name}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[12px] text-slate-500 tabular-nums">
                                            {staff.email}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-[11px] font-bold tracking-tight ${staff.role === 'ADMIN' ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {staff.role === 'ADMIN' ? 'Administrator' : 'Kasir'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[12px] font-medium text-slate-500">
                                            {new Date(staff.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 text-slate-300 hover:text-slate-900 transition-all">
                                            <MoreVertical className="w-4 h-4 opacity-30 hover:opacity-100" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
