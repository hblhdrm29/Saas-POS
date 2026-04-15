import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import logoBlueiy from "../assets/logo/blueiy_premium.png";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen font-sans bg-slate-50/50 text-slate-900 selection:bg-blue-100 items-center justify-center p-6">

      {/* Centered Login Card */}
      <div className="w-full max-w-[28rem] bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 sm:p-12 relative overflow-hidden">

        {/* Simple Icon Back Button */}
        <Link href="/" className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:text-[#0B47A9] hover:bg-slate-50 transition-colors z-20" title="Kembali ke Beranda">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none -z-10"></div>

        {/* Blue Logo Header */}
        <div className="flex justify-center mb-10">
          <Image src={logoBlueiy} alt="Blueiy Logo" width={160} height={50} className="object-contain" />
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2 font-display">Selamat datang</h2>
          <p className="text-slate-500 text-sm">Silakan masukkan kredensial Anda untuk mengakses terminal kasir.</p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            const email = formData.get("email") as string;
            const redirectTo = email.includes("admin") ? "/admin" : "/kasir";

            try {
              await signIn("credentials", {
                ...Object.fromEntries(formData),
                redirectTo
              });
            } catch (error: any) {
              if (error.type === "CredentialsSignin") {
                redirect("/login?error=InvalidCredentials");
              }
              throw error;
            }
          }}
          className="flex flex-col space-y-5"
        >
          <div>
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@blueiy.com"
              required
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 placeholder-slate-400 transition-all focus:border-[#0B47A9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-900/10 text-slate-900 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-bold text-slate-700 uppercase tracking-wide">Password</label>
              <a href="#" className="text-xs font-semibold text-[#0B47A9] hover:text-blue-800 transition-colors">Lupa sandi?</a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 placeholder-slate-400 transition-all focus:border-[#0B47A9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-900/10 text-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center text-sm mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded text-[#0B47A9] focus:ring-[#0B47A9] border-slate-300 w-4 h-4 cursor-pointer" />
              <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">Ingat saya</span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-[#0B47A9] hover:shadow-blue-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Masuk ke Dashboard
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-slate-500 font-medium">
          Belum punya akun? <a href="#" className="font-bold text-[#0B47A9] hover:text-blue-800">Hubungi Sales Manager Anda.</a>
        </p>
      </div>
    </div>
  );
}
