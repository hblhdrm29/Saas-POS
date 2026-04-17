"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import ShiftLogoutModal from "./ShiftLogoutModal";

export default function LogoutButton({ activeShift }: { activeShift: any }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="w-full p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90 flex items-center justify-center"
                title="Keluar / Tutup Shift"
            >
                <LogOut className="w-5 h-5" />
            </button>

            {showModal && (
                <ShiftLogoutModal 
                    activeShift={activeShift} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </>
    );
}
