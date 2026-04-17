"use client";

import { useActionState, useState } from "react";
import { AlertCircle, X, Loader2 } from "lucide-react";
import { authenticate } from "@/app/actions/auth_actions";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(authenticate, undefined);
  const [hideError, setHideError] = useState(false);

  // Reset hidden state when a new error comes in
  const showError = state?.error && !hideError;

  return (
    <form
      action={(formData) => {
        setHideError(false);
        action(formData);
      }}
      className="w-full flex flex-col space-y-3"
    >
      {/* Warning Message if Password is Wrong */}
      {showError && (
        <div className="flex items-center justify-between gap-3 p-3 bg-red-50 border border-red-100 rounded-xl mb-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-[12px] font-bold text-red-600">Email atau password salah</p>
          </div>
          <button 
            type="button"
            onClick={() => setHideError(true)}
            className="p-1 hover:bg-red-100 rounded-md transition-colors text-red-400 hover:text-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email address"
        required
        disabled={isPending}
        className="block w-full rounded-xl border border-slate-200 bg-slate-50/20 px-4 py-3.5 placeholder-slate-400 focus:border-slate-400 focus:outline-none text-[14px] transition-all font-medium disabled:opacity-50"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        required
        disabled={isPending}
        className="block w-full rounded-xl border border-slate-200 bg-slate-50/20 px-4 py-3.5 placeholder-slate-400 focus:border-slate-400 focus:outline-none text-[14px] transition-all font-medium disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 flex w-full items-center justify-center rounded-2xl bg-[#0095F6] px-4 py-2.5 text-[14px] font-bold text-white shadow-sm hover:bg-[#0074CC] transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sedang masuk...</span>
          </div>
        ) : (
          "Log masuk"
        )}
      </button>

      <div className="text-center pt-4">
        <a href="#" className="text-[13px] font-medium text-slate-800 hover:text-black">Lupa kata sandi?</a>
      </div>

      <div className="flex flex-col space-y-4 pt-10">
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-2xl border border-[#0095F6] px-4 py-3 text-[14px] font-bold text-[#0095F6] hover:bg-blue-50 transition-all"
        >
          Buat akun baru
        </button>
      </div>
    </form>
  );
}
