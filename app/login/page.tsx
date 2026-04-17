import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import logoBlueiy from "../assets/logo/blueiy_premium.png";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-blue-100 font-jakarta">
      {/* Top Navigation Header */}
      <div className="w-full max-w-[1400px] mx-auto px-8 lg:px-16 py-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-medium text-sm"
        >
          <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:border-slate-200 group-hover:bg-slate-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>
        <Image src={logoBlueiy} alt="Blueiy Logo" width={140} height={40} className="object-contain" />
      </div>

      <div className="flex-1 flex items-center justify-center -mt-12">
        <div className="flex flex-col lg:flex-row w-full max-w-[1200px] px-6 lg:px-12 py-12 gap-12 lg:gap-0 items-center justify-center lg:items-stretch">
          
          {/* Left Side: Branding & AI Visuals - Dynamic & Stacked */}
          <div className="flex-1 flex flex-col items-center lg:items-end justify-center lg:pr-24">
            <div className="w-full max-w-[460px] space-y-10 text-center lg:text-left">
              <div className="space-y-6">
                 <h1 className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                   Satu platform untuk semua kebutuhan <span className="text-[#0866FF]">toko Anda.</span>
                 </h1>
              </div>

              {/* Stacked AI Assets */}
              <div className="relative pt-6 hidden sm:block">
                 <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(8,102,255,0.12)] border-[10px] border-white transform -rotate-2 hover:rotate-0 transition-all duration-700">
                    <Image src="/images/login/pos_hero.png" alt="POS Modern" width={450} height={320} className="object-cover h-80" />
                 </div>
                 <div className="absolute -top-6 -right-6 lg:-right-10 z-20 rounded-[1.8rem] overflow-hidden shadow-2xl border-[6px] border-white transform rotate-6 translate-y-16 w-52 hidden lg:block hover:-translate-y-2 transition-all duration-500">
                    <Image src="/images/login/pos_detail.png" alt="POS Interaction" width={220} height={160} className="object-cover h-36" />
                 </div>
              </div>
            </div>
          </div>

          {/* Dynamic Vertical Divider Line - Centered */}
          <div className="hidden lg:block w-px bg-slate-100 self-stretch"></div>

          {/* Right Side: Instagram-style Login Form - Balanced */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-center lg:pl-20">
            <div className="w-full max-w-[360px] space-y-8 flex flex-col items-center lg:items-start">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Log masuk Blueiy</h2>
              
              <form
                action={async (formData) => {
                  "use server";
                  const email = formData.get("email") as string;
                  
                  // Check user role from DB to determine redirect correctly
                  let redirectTo = "/kasir";
                  try {
                    const { db } = await import("@/db");
                    const { users } = await import("@/db/schema");
                    const { eq } = await import("drizzle-orm");
                    
                    const userRecords = await db.select().from(users).where(eq(users.email, email));
                    if (userRecords[0]?.role === "ADMIN") {
                      redirectTo = "/admin";
                    }
                  } catch (e) {
                    console.error("Redirect check failed", e);
                  }

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
                className="w-full flex flex-col space-y-3"
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/20 px-4 py-3.5 placeholder-slate-400 focus:border-slate-400 focus:outline-none text-[14px] transition-all font-medium"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/20 px-4 py-3.5 placeholder-slate-400 focus:border-slate-400 focus:outline-none text-[14px] transition-all font-medium"
                />

                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-2xl bg-[#0095F6]/50 px-4 py-2.5 text-[14px] font-bold text-white shadow-sm hover:bg-[#0095F6] transition-all duration-300"
                >
                  Log masuk
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
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding - Adjusted Typography */}
      <footer className="w-full bg-slate-50/50 border-t border-slate-100 py-6">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-[12px] font-medium">
          <div className="flex items-center gap-2">
             <span>© 2026 Blueiy POS</span>
             <div className="w-1 h-1 rounded-full bg-slate-200" />
             <span>Meta POS Inc.</span>
          </div>
          <div className="flex gap-8">
             <a href="#" className="hover:text-blue-600 transition-colors">Privasi</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Ketentuan</a>
             <a href="#" className="hover:text-blue-600 transition-colors">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
