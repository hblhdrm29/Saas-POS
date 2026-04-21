"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Loader2 } from "lucide-react";

export default function DateFilter({ currentDate }: { currentDate: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [localDate, setLocalDate] = useState(currentDate);

    // Sync local state if prop changes (e.g. navigation)
    useEffect(() => {
        setLocalDate(currentDate);
    }, [currentDate]);

    function handleDateChange(newDate: string) {
        setLocalDate(newDate);
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("date", newDate);
            router.push(`?${params.toString()}`);
        });
    }

    return (
        <div className="relative group">
            <div className={`flex items-center px-2.5 py-1.5 bg-white border rounded-xl shadow-sm transition-all duration-300 ${
                isPending ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-100 hover:border-slate-300"
            }`}>
                <input
                    type="date"
                    value={localDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer [color-scheme:light]"
                    disabled={isPending}
                />
            </div>
            
            {isPending && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full animate-pulse" />
            )}
        </div>
    );
}
