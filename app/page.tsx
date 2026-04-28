"use client";

import { useState } from "react";
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
   ChevronDown,
   Play,
   CheckCircle2,
   Activity
} from "lucide-react";

import logoBlueiy from "./assets/logo/blueiy_premium.png";

const industriesData = [
   {
      id: "grocery",
      title: "Grocery Store",
      img: "grocery.png",
      desc: "Grocery stores need a POS system that can manage a large inventory and provide quick checkout services. Blueiy offers powerful features to streamline your store operations and enhance customer satisfaction.",
      accent: "from-teal-400/20 to-emerald-400/20"
   },
   {
      id: "vape",
      title: "Vape Shop",
      img: "vape.png",
      desc: "Vape shops require precise inventory tracking and age verification features. Blueiy provides a sleek interface to manage varieties of flavors and accessories with ease.",
      accent: "from-purple-400/20 to-blue-400/20"
   },
   {
      id: "books",
      title: "Book Store",
      img: "store.png",
      desc: "Manage thousands of SKUs and categories effortlessly. Our system helps bookstores track bestsellers and handle multi-item transactions in seconds.",
      accent: "from-amber-400/20 to-orange-400/20"
   },
   {
      id: "general",
      title: "General Store",
      img: "store.png",
      desc: "A versatile solution for general retail. Handle diverse product ranges, from snacks to household items, with our intuitive and fast checkout system.",
      accent: "from-blue-400/20 to-indigo-400/20"
   },
   {
      id: "jewelry",
      title: "Jewelry Store",
      img: "restaurant.png",
      desc: "High-value items require high-level security and tracking. Blueiy ensures every precious item is accounted for with detailed reporting and audit trails.",
      accent: "from-yellow-400/20 to-amber-400/20"
   },
   {
      id: "vitamin",
      title: "Vitamin Store",
      img: "store.png",
      desc: "Help your customers stay healthy with quick service and clear product categorization for supplements and wellness products.",
      accent: "from-green-400/20 to-emerald-400/20"
   },
   {
      id: "toy",
      title: "Toy Shop",
      img: "toys.png",
      desc: "Make every child's visit exciting with a fast POS that handles seasonal rushes and diverse toy categories effortlessly.",
      accent: "from-red-400/20 to-pink-400/20"
   },
   {
      id: "thrift",
      title: "Thrift Store",
      img: "thrift.png",
      desc: "Unique items need a flexible system. Blueiy allows you to quickly add one-off items and manage diverse inventory with custom tags.",
      accent: "from-cyan-400/20 to-blue-400/20"
   },
   {
      id: "fashion",
      title: "Fashion Boutique",
      img: "thrift.png",
      desc: "Manage sizes, colors, and styles with our advanced variant tracking. Keep your boutique on trend with real-time stock alerts.",
      accent: "from-fuchsia-400/20 to-purple-400/20"
   },
   {
      id: "liquor",
      title: "Liquor Store",
      img: "liquor.png",
      desc: "Compliance and speed in one package. Track your premium stock and ensure smooth transactions even during peak hours.",
      accent: "from-slate-400/20 to-blue-900/10"
   }
];

export default function Home() {
   const [activeTab, setActiveTab] = useState(industriesData[0]);
   return (
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">

         {/* Navigation */}
         <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 py-0.5">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Image src={logoBlueiy} alt="BLUEIY POS Logo" width={110} height={35} className="object-contain" />
               </div>

               <div className="hidden md:flex items-center gap-6 text-[12px] font-semibold text-slate-600">
                  <div className="relative flex items-center gap-1 cursor-pointer hover:text-[#0B47A9] transition-colors group py-1.5">
                     Produk <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
                  </div>
                  <a href="#hardware" className="relative py-1.5 hover:text-[#0B47A9] transition-colors group">
                     Hardware
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a href="#solutions" className="relative py-1.5 hover:text-[#0B47A9] transition-colors group">
                     Solusi Bisnis
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a href="#pricing" className="relative py-1.5 hover:text-[#0B47A9] transition-colors group">
                     Harga
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                  <a href="#resources" className="relative py-1.5 hover:text-[#0B47A9] transition-colors group">
                     Bantuan
                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B47A9] transition-all duration-300 group-hover:w-full"></span>
                  </a>
               </div>

               <div className="flex items-center gap-3">
                  <Link href="#" className="hidden sm:block text-[12px] font-bold text-slate-700 hover:text-white hover:bg-slate-900 px-4 py-2 rounded-full transition-all">
                     Contact Me
                  </Link>
                  <Link href="/login" className="px-5 py-2 bg-[#0B47A9] text-white rounded-full hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 font-bold text-[12px]">
                     Masuk
                  </Link>
               </div>
            </div>
         </nav>

         <main className="pt-16">

            {/* HERO SECTION */}
            <section className="relative pt-10 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-slate-50">
               <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                  {/* Left Column: Text Content */}
                  <div className="max-w-lg lg:pl-10">
                     <span className="text-[10px] font-bold text-[#0B47A9] tracking-widest mb-4 block uppercase">Tentang Blueiy</span>

                     <p className="text-[11px] md:text-xs text-slate-400 mb-6 leading-relaxed border-l border-slate-200 pl-4 max-w-md">
                        Ekosistem manajemen bisnis cerdas yang menyatukan operasional kasir, inventaris, dan pesanan pelanggan dalam satu platform terpadu.
                     </p>
                     <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-[1.2] tracking-tight mb-6">
                        Kelola pesanan lebih cepat & akurat dengan <br />
                        <span className="italic text-[#0B47A9]">Contactless Order</span>
                     </h1>
                     <p className="text-sm md:text-base text-slate-600 mb-8 leading-relaxed max-w-md">
                        Terima ragam pilihan cara pesan yang lebih cepat dan akurat untuk bisnis kuliner, mulai dari dine-in, pick-up, hingga delivery.
                     </p>
                     <Link href="/login" className="inline-flex items-center gap-2 text-[#0B47A9] font-bold text-sm hover:text-blue-800 transition-colors group">
                        Pelajari <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>

                  {/* Right Column: Image Content */}
                  <div className="relative mt-10 lg:mt-0 flex justify-center lg:justify-end">
                     {/* Yellow Background Shape with shadow */}
                     <div className="absolute inset-x-4 inset-y-0 bg-yellow-400 rounded-[2.5rem] w-[85%] h-full ml-auto -z-10 shadow-xl shadow-yellow-500/10"></div>

                     {/* AI Generated Barista Image */}
                     <div className="relative z-10 p-4 w-full max-w-md">
                        <img
                           src="/hero_barista.png"
                           alt="Cafe owner holding POS tablet"
                           className="w-full h-auto object-cover rounded-2xl shadow-lg border-[3px] border-white"
                        />
                     </div>
                  </div>

               </div>
            </section>

            {/* INDUSTRY SWITCHER SECTION */}
            <section className="py-16 bg-white border-y border-slate-50">
               <div className="max-w-7xl mx-auto px-6">
                  {/* Tabs Rows */}
                  <div className="flex flex-col gap-3 mb-12 text-center">
                     <h2 className="text-[#0B47A9] font-bold text-[10px] uppercase tracking-widest mb-6">Pilih Jenis Bisnis Anda</h2>

                     {/* Row 1 */}
                     <div className="flex flex-wrap justify-center gap-2">
                        {industriesData.slice(0, 5).map((industry) => (
                           <button
                              key={industry.id}
                              onClick={() => setActiveTab(industry)}
                              className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all border ${activeTab.id === industry.id
                                 ? "bg-[#090924] text-white border-[#090924] shadow-md scale-105"
                                 : "bg-white text-slate-600 border-slate-200 hover:border-[#0B47A9]"
                                 }`}
                           >
                              {industry.title}
                           </button>
                        ))}
                     </div>
                     {/* Row 2 */}
                     <div className="flex flex-wrap justify-center gap-2">
                        {industriesData.slice(5).map((industry) => (
                           <button
                              key={industry.id}
                              onClick={() => setActiveTab(industry)}
                              className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all border ${activeTab.id === industry.id
                                 ? "bg-[#090924] text-white border-[#090924] shadow-md scale-105"
                                 : "bg-white text-slate-600 border-slate-200 hover:border-[#0B47A9]"
                                 }`}
                           >
                              {industry.title}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Content Card */}
                  <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[400px]">
                     {/* Left Content */}
                     <div className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br ${activeTab.accent} transition-all duration-700`}>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
                           {activeTab.title}
                        </h2>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-sm">
                           {activeTab.desc}
                        </p>
                        <p className="text-slate-400 mb-8 text-[11px] italic">
                           Signup for free trial and see how Blueiy can do wonder for you!
                        </p>
                        <div>
                           <Link href="/login" className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-bold text-[11px] hover:bg-slate-800 transition-all active:scale-95">
                              Start 30-day Free Trial Now!
                           </Link>
                        </div>
                     </div>

                     {/* Right Image */}
                     <div className="w-full md:w-1/2 relative overflow-hidden bg-slate-50">
                        <img
                           key={activeTab.id}
                           src={`/industries/${activeTab.img}`}
                           alt={activeTab.title}
                           className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 animate-in fade-in zoom-in-95"
                        />
                     </div>
                  </div>
               </div>
            </section>

            <section id="features" className="py-20 bg-slate-50/30">
               <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                  <h2 className="text-[10px] font-bold text-[#0B47A9] tracking-wider mb-3">Fitur Unggulan</h2>
                  <p className="text-xl md:text-2xl font-bold text-slate-900 mb-4">Semua yang Anda butuhkan untuk <br className="hidden md:block" /> mengelola bisnis retail Anda.</p>
               </div>

               <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1 */}
                  <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                     <div className="w-12 h-12 bg-blue-50 text-[#0B47A9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0B47A9] group-hover:text-white transition-all">
                        <LayoutDashboard className="w-6 h-6" />
                     </div>
                     <h3 className="text-base font-bold mb-3 text-slate-900">Dashboard Real-time</h3>
                     <p className="text-xs text-slate-500 leading-relaxed">Pantau performa penjualan, laba, dan transaksi dari dashboard admin secara instan dari perangkat mana saja.</p>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                     <div className="w-12 h-12 bg-blue-50 text-[#0B47A9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0B47A9] group-hover:text-white transition-all">
                        <Box className="w-6 h-6" />
                     </div>
                     <h3 className="text-base font-bold mb-3 text-slate-900">Manajemen Inventaris</h3>
                     <p className="text-xs text-slate-500 leading-relaxed">Lacak stok barang masuk dan keluar secara otomatis. Dapatkan notifikasi saat stok menepis untuk hindari kehabisan.</p>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white p-8 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                     <div className="w-12 h-12 bg-blue-50 text-[#0B47A9] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0B47A9] group-hover:text-white transition-all">
                        <Smartphone className="w-6 h-6" />
                     </div>
                     <h3 className="text-base font-bold mb-3 text-slate-900">Aplikasi Kasir Mobile</h3>
                     <p className="text-xs text-slate-500 leading-relaxed">Ubah smartphone atau tablet Anda menjadi terminal kasir yang powerful. Mendukung printer thermal dan scanner barcode.</p>
                  </div>
               </div>
            </section>

            {/* NEW VIDEO DEMO SECTION */}
            <section className="py-24 bg-white overflow-hidden">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl">
                     {/* Decorative background glow */}
                     <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

                     <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side: Video Player */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl group/video">
                           <video
                              className="w-full h-full object-cover"
                              controls
                           >
                              <source src="/videos/Video Project.mp4" type="video/mp4" />
                              Your browser does not support the video tag.
                           </video>

                           {/* Subtle overlay when not playing (optional style) */}
                           <div className="absolute inset-0 bg-slate-900/10 pointer-events-none group-hover/video:bg-transparent transition-all duration-500"></div>
                        </div>

                        {/* Right Side: Summary Content */}
                        <div className="space-y-8">
                           <div>
                              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                                 Blueiy POS <br />
                              </h2>
                              <p className="text-slate-400 text-base leading-relaxed">
                                 Saksikan bagaimana Blueiy POS mempermudah operasional bisnis Anda, mulai dari transaksi kilat hingga laporan inventaris otomatis yang bisa diakses kapan saja.
                              </p>
                           </div>

                           <div className="space-y-4">
                              {[
                                 { title: "Transaksi Kilat", desc: "Proses checkout pelanggan kurang dari 5 detik." },
                                 { title: "Stok Real-time", desc: "Update inventaris otomatis di setiap transaksi." },
                                 { title: "Insight Bisnis", desc: "Pantau laba rugi harian langsung dari gadget Anda." }
                              ].map((item, idx) => (
                                 <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                    <div className="mt-1">
                                       <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                       <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                       <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>

                           <div className="pt-4">
                              <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-all text-sm">
                                 Coba Gratis Sekarang <ArrowRight className="w-4 h-4" />
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* SHOWCASE SECTION (Z-PATTERN) */}
            <section id="solutions" className="py-32">
               <div className="max-w-7xl mx-auto px-6 space-y-40">

               </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-24 bg-slate-50/50" style={{ fontFamily: 'Arial, sans-serif' }}>
               <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-16">
                     <h2 className="text-xs font-bold text-[#0B47A9] mb-4">Paket Harga</h2>
                     <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Investasi terbaik untuk <br className="hidden md:block" /> pertumbuhan bisnis Anda</p>
                     <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">Pilih paket yang paling sesuai dengan skala operasional Anda saat ini. Semua paket termasuk update sistem gratis.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {/* Starter Tier */}
                     <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="mb-8">
                           <h3 className="text-sm font-bold text-slate-400 mb-4">Starter</h3>
                           <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold">Rp</span>
                              <span className="text-4xl font-bold text-slate-900">30k</span>
                              <span className="text-slate-400 text-xs font-bold">/bln</span>
                           </div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                           {["1 Terminal Kasir", "Laporan harian", "Manajemen stok dasar", "Support komunitas"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                 <CheckCircle2 className="w-4 h-4 text-[#0B47A9]" /> {item}
                              </li>
                           ))}
                        </ul>
                        <Link href="/login" className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-xs text-center hover:bg-slate-200 transition-all">
                           Mulai sekarang
                        </Link>
                     </div>

                     {/* Lite Tier */}
                     <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="mb-8">
                           <h3 className="text-sm font-bold text-slate-400 mb-4">Lite</h3>
                           <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold">Rp</span>
                              <span className="text-4xl font-bold text-slate-900">75k</span>
                              <span className="text-slate-400 text-xs font-bold">/bln</span>
                           </div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                           {["2 Terminal Kasir", "Laporan mingguan", "Inventory management", "Support email"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                 <CheckCircle2 className="w-4 h-4 text-[#0B47A9]" /> {item}
                              </li>
                           ))}
                        </ul>
                        <Link href="/login" className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-xs text-center hover:bg-slate-200 transition-all">
                           Mulai sekarang
                        </Link>
                     </div>

                     {/* Pro Tier (Popular) */}
                     <div className="bg-white rounded-[2rem] p-8 border-2 border-[#0B47A9] shadow-2xl shadow-blue-900/10 flex flex-col hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#0B47A9] text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold">
                           Populer
                        </div>
                        <div className="mb-8">
                           <h3 className="text-sm font-bold text-[#0B47A9] mb-4">Pro Business</h3>
                           <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold">Rp</span>
                              <span className="text-4xl font-bold text-slate-900">200k</span>
                              <span className="text-slate-400 text-xs font-bold">/bln</span>
                           </div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                           {["Terminal terbatas", "Laporan real-time", "Multi-warehouse", "24/7 priority support", "Custom branding"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                 <CheckCircle2 className="w-4 h-4 text-[#0B47A9]" /> {item}
                              </li>
                           ))}
                        </ul>
                        <Link href="/login" className="w-full py-4 bg-[#0B47A9] text-white rounded-2xl font-bold text-xs text-center hover:bg-blue-800 transition-all shadow-lg shadow-blue-500/20">
                           Pilih paket
                        </Link>
                     </div>

                     {/* Ultimate Tier */}
                     <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="mb-8">
                           <h3 className="text-sm font-bold text-slate-400 mb-4">Ultimate</h3>
                           <div className="flex items-baseline gap-1">
                              <span className="text-lg font-bold">Rp</span>
                              <span className="text-4xl font-bold text-slate-900">499k</span>
                              <span className="text-slate-400 text-xs font-bold">/bln</span>
                           </div>
                        </div>
                        <ul className="space-y-4 mb-10 flex-1">
                           {["Unlimited terminal", "Enterprise dashboard", "API access", "Dedicated manager", "On-site training"].map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                 <CheckCircle2 className="w-4 h-4 text-[#0B47A9]" /> {item}
                              </li>
                           ))}
                        </ul>
                        <Link href="/login" className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-xs text-center hover:bg-slate-200 transition-all">
                           Hubungi sales
                        </Link>
                     </div>
                  </div>
               </div>
            </section>

            {/* PAYMENTS PROCESSING SECTION */}
            <section className="py-20 bg-[#0B47A9] relative overflow-hidden">
               <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                     Payments Processing included in <span className="text-blue-200">Blueiy</span>
                  </h2>
                  <p className="text-blue-100/60 text-[11px] mb-12 max-w-lg mx-auto leading-relaxed">
                     Terima pembayaran otomatis dengan integrasi QRIS, DANA, BCA, Mandiri, dan BRI.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
                     {/* DANA */}
                     <div className="bg-white rounded-2xl h-16 flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform overflow-hidden">
                        <img src="/payments/dana.png" alt="DANA" className="h-full w-full object-contain" />
                     </div>
                     {/* MANDIRI */}
                     <div className="bg-white rounded-2xl h-16 flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform overflow-hidden font-bold text-[#003D79] text-sm tracking-tighter">
                        mandiri<span className="text-yellow-500 italic ml-0.5">/</span>
                     </div>
                     {/* BRI */}
                     <div className="bg-white rounded-2xl h-16 flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform overflow-hidden">
                        <img src="/payments/bri.png" alt="BRI" className="h-full w-full object-contain" />
                     </div>
                     {/* BCA */}
                     <div className="bg-white rounded-2xl h-16 flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform overflow-hidden">
                        <img src="/payments/bca.png" alt="BCA" className="h-full w-full object-contain" />
                     </div>
                     {/* QRIS */}
                     <div className="bg-white rounded-2xl h-16 flex items-center justify-center p-4 shadow-xl hover:scale-105 transition-transform overflow-hidden">
                        <img src="/payments/qris.png" alt="QRIS" className="h-full w-full object-contain p-1" />
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
                     <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">Siap Memajukan <br /> Bisnis Anda Hari Ini?</h2>
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
