import Link from "next/link";
import Image from "next/image";
import { 
  BadgeDollarSign, 
  LayoutDashboard, 
  Zap, 
  ShieldCheck, 
  Box, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Users,
  Smartphone,
  ChevronDown
} from "lucide-react";

import logoBlueiy from "./assets/logo/blueiy_premium.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-slate-100 z-50 py-1">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={logoBlueiy} alt="BLUEIY POS Logo" width={130} height={40} className="object-contain" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-600">
            <div className="relative flex items-center gap-1 cursor-pointer hover:text-[#0B47A9] transition-colors group py-2">
               Produk <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
            </div>
            <a href="#hardware" className="relative py-2 hover:text-[#0B47A9] transition-colors group">
               Hardware
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#solutions" className="relative py-2 hover:text-[#0B47A9] transition-colors group">
               Solusi Bisnis
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="relative py-2 hover:text-[#0B47A9] transition-colors group">
               Harga
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#resources" className="relative py-2 hover:text-[#0B47A9] transition-colors group">
               Bantuan
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="hidden sm:block text-[13px] font-bold text-slate-700 hover:text-white hover:bg-slate-900 px-6 py-2.5 rounded-full transition-all">
              Contact Me
            </Link>
            <Link href="/login" className="px-6 py-2.5 bg-[#0B47A9] text-white rounded-full hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 font-bold text-[13px]">
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0B47A9] text-[10px] font-bold uppercase tracking-wider mb-8 border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-[#0B47A9]"></span>
              Sistem POS SaaS Terpercaya
            </div>
            
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1] font-display">
              Kelola Bisnis Makin <br className="hidden md:block" />
              <span className="text-[#0B47A9]">Cepat & Akurat.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-500 mb-12 leading-relaxed">
              Solusi terminal kasir (POS) modern yang dirancang untuk mendukung pertumbuhan UMKM. 
              Mulai dari inventaris gudang hingga laporan penjualan secara real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 font-bold">
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-[#0B47A9] text-white rounded-2xl hover:bg-blue-800 hover:shadow-2xl hover:shadow-blue-900/20 transition-all flex items-center justify-center gap-2">
                Mulai Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl hover:border-blue-300 hover:text-[#0B47A9] transition-all flex items-center justify-center gap-2">
                Lihat Demo
              </Link>
            </div>

            {/* Product Mockup Representation */}
            <div className="relative max-w-5xl mx-auto mt-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-[#0B47A9] rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white p-2 rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden">
                <div className="bg-slate-50 rounded-[1.5rem] aspect-video flex items-center justify-center border border-slate-100 overflow-hidden relative">
                   {/* Abstract Dashboard UI representation */}
                   <div className="w-full h-full p-8 flex flex-col gap-6">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                         <div className="w-32 h-4 bg-slate-100 rounded-full"></div>
                         <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50"></div>
                            <div className="w-8 h-8 rounded-lg bg-blue-50"></div>
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 flex-1">
                         <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-50">
                            <div className="w-48 h-6 bg-blue-50 rounded-full mb-8"></div>
                            <div className="space-y-4">
                               <div className="w-full h-40 bg-slate-50 rounded-xl"></div>
                            </div>
                         </div>
                         <div className="bg-[#0B47A9] rounded-2xl p-6 shadow-lg">
                            <div className="w-20 h-4 bg-blue-400/30 rounded-full mb-6"></div>
                            <div className="w-full h-32 bg-white/10 rounded-xl border border-white/5"></div>
                         </div>
                      </div>
                   </div>
                   {/* Blur Overlay to hint it's a preview */}
                   <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO WALL / TRUST BAR */}
        <section className="py-12 border-y border-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Digunakan oleh bisnis retail modern</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
               <span className="text-xl font-black italic">RETAILCO</span>
               <span className="text-xl font-black italic">SMARTSTORE</span>
               <span className="text-xl font-black italic">QUICKPOS</span>
               <span className="text-xl font-black italic">BLUEIYNET</span>
               <span className="text-xl font-black italic">TECHBASKET</span>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-32 bg-slate-50/50">
           <div className="max-w-7xl mx-auto px-6 text-center mb-20">
              <h2 className="text-xs font-bold text-[#0B47A9] uppercase tracking-[0.2em] mb-4">Fitur Unggulan</h2>
              <p className="text-2xl font-black text-slate-900 mb-6">Semua yang Anda butuhkan untuk <br className="hidden md:block"/> mengelola bisnis retail Anda.</p>
           </div>

           <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                 <div className="w-14 h-14 bg-blue-50 text-[#0B47A9] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0B47A9] group-hover:text-white transition-all">
                    <LayoutDashboard className="w-7 h-7" />
                 </div>
                 <h3 className="text-lg font-bold mb-4">Dashboard Real-time</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">Pantau performa penjualan, laba, dan transaksi dari dashboard admin secara instan dari perangkat mana saja.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                 <div className="w-14 h-14 bg-blue-50 text-[#0B47A9] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0B47A9] group-hover:text-white transition-all">
                    <Box className="w-7 h-7" />
                 </div>
                 <h3 className="text-lg font-bold mb-4">Manajemen Inventaris</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">Lacak stok barang masuk dan keluar secara otomatis. Dapatkan notifikasi saat stok menepis untuk hindari kehabisan.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                 <div className="w-14 h-14 bg-blue-50 text-[#0B47A9] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0B47A9] group-hover:text-white transition-all">
                    <Smartphone className="w-7 h-7" />
                 </div>
                 <h3 className="text-lg font-bold mb-4">Aplikasi Kasir Mobile</h3>
                 <p className="text-sm text-slate-500 leading-relaxed">Ubah smartphone atau tablet Anda menjadi terminal kasir yang powerful. Mendukung printer thermal dan scanner barcode.</p>
              </div>
           </div>
        </section>

        {/* SHOWCASE SECTION (Z-PATTERN) */}
        <section id="solutions" className="py-32">
           <div className="max-w-7xl mx-auto px-6 space-y-40">
              
              {/* Z-Item 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                       <ShieldCheck className="w-6 h-6 text-[#0B47A9]" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-6 leading-tight">Keamanan Data Tenant yang Terisolasi.</h2>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                       Setiap bisnis memiliki database yang terisolasi dengan teknologi Server Actions dan Drizzle ORM. Data Anda aman dan tidak akan pernah bocor antar cabang.
                    </p>
                    <ul className="text-sm space-y-4 font-semibold text-slate-700">
                       <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-100 text-[#0B47A9] rounded-full flex items-center justify-center"><ChevronRight className="w-3 h-3" /></div>
                          Enkripsi end-to-end
                       </li>
                       <li className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-blue-100 text-[#0B47A9] rounded-full flex items-center justify-center"><ChevronRight className="w-3 h-3" /></div>
                          Backup harian otomatis
                       </li>
                    </ul>
                 </div>
                 <div className="bg-slate-100 rounded-[3rem] aspect-square relative overflow-hidden flex items-center justify-center">
                    <div className="bg-white w-4/5 h-4/5 rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                        <TrendingUp className="w-12 h-12 text-[#0B47A9] mb-8" />
                        <div className="space-y-4">
                           <div className="w-full h-8 bg-slate-50 rounded-lg"></div>
                           <div className="w-2/3 h-8 bg-slate-50 rounded-lg"></div>
                           <div className="w-full h-32 bg-slate-50 rounded-2xl"></div>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Z-Item 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="order-2 lg:order-1 bg-slate-800 rounded-[3rem] aspect-square relative overflow-hidden flex items-center justify-center group">
                    <div className="bg-slate-900 w-4/5 h-4/5 rounded-3xl shadow-2xl p-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-700">
                        <Users className="w-12 h-12 text-blue-400 mb-8" />
                        <div className="space-y-6">
                           <div className="w-3/4 h-6 bg-slate-800 rounded-full"></div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="h-20 bg-slate-800 rounded-2xl"></div>
                              <div className="h-20 bg-slate-800 rounded-2xl"></div>
                           </div>
                           <div className="w-full h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl"></div>
                        </div>
                    </div>
                 </div>
                 <div className="order-1 lg:order-2">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                       <Users className="w-6 h-6 text-[#0B47A9]" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-6 leading-tight">Kolaborasi Tim Jadi Lebih Mudah.</h2>
                    <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                       Kelola hak akses untuk manajer, gudang, dan kasir dalam satu panel kendali. Pantau login dan tindakan mencurigakan secara real-time.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <p className="text-xl font-black text-slate-900 mb-1">99.9%</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Uptime SLA</p>
                       </div>
                       <div>
                          <p className="text-xl font-black text-slate-900 mb-1">24/7</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bantuan Teknis</p>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-24 px-6">
           <div className="max-w-5xl mx-auto bg-[#0B47A9] rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/40">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 blur-[120px] opacity-20 -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900 blur-[100px] opacity-40 -ml-40 -mb-40"></div>
              
              <div className="relative z-10">
                 <h2 className="text-2xl md:text-3xl font-black mb-8 leading-tight">Siap Memajukan <br/> Bisnis Anda Hari Ini?</h2>
                 <p className="text-blue-100 text-sm md:text-base mb-12 max-w-2xl mx-auto opacity-80">
                    Gabung dengan komunitas retailer modern yang sudah beralih ke Blueiy POS. Sistem kasir yang bukan hanya cepat, tapi juga cerdas melayani pelanggan.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-bold">
                    <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-white text-[#0B47A9] rounded-2xl hover:scale-105 transition-all text-sm">
                       Mulai Uji Coba Gratis
                    </Link>
                    <Link href="/login" className="w-full sm:w-auto text-white text-sm underline underline-offset-8 decoration-blue-400 hover:text-blue-200 transition-colors">
                       Hubungi Sales Admin
                    </Link>
                 </div>
              </div>
           </div>
        </section>

      </main>

      <footer className="w-full bg-slate-50 px-6 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
           <div className="col-span-1 md:col-span-2">
              <Image src={logoBlueiy} alt="Blueiy Logo" width={140} height={45} className="grayscale opacity-50 mb-8" />
              <p className="text-slate-500 max-w-sm leading-relaxed mb-0">
                 Platform SaaS Point of Sale tercanggih untuk UMKM Indonesia. Membangun masa depan retail satu transaksi pada satu waktu.
              </p>
           </div>
           <div>
              <h4 className="font-bold mb-6 text-slate-900">Produk</h4>
              <ul className="space-y-4 text-slate-500">
                 <li><a href="#" className="hover:text-[#0B47A9]">Fitur Kasir</a></li>
                 <li><a href="#" className="hover:text-[#0B47A9]">Dashboard Admin</a></li>
                 <li><a href="#" className="hover:text-[#0B47A9]">Integrasi API</a></li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold mb-6 text-slate-900">Bantuan</h4>
              <ul className="space-y-4 text-slate-500">
                 <li><a href="#" className="hover:text-[#0B47A9]">Dokumentasi</a></li>
                 <li><a href="#" className="hover:text-[#0B47A9]">Panduan Akun</a></li>
                 <li><a href="#" className="hover:text-[#0B47A9]">Kebijakan Privasi</a></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
           &copy; {new Date().getFullYear()} BLUEIY POS Systems. Memberdayakan bisnis retail modern.
        </div>
      </footer>
    </div>
  );
}
