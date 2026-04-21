import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Receipt, LogOut, Ticket, Users, History, Warehouse, Settings, Search, Plus } from "lucide-react";
import { signOut } from "@/auth";
import Image from "next/image";
import SidebarNav from "./_components/SidebarNav";

import logoBlueiy from "../assets/logo/blueiy_premium.png";

import AdminShell from "./_components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Cast because session.user extended
  const user = session.user as any;

  if (user.role !== "ADMIN") {
    // If Cashier tries to access Admin
    redirect("/kasir");
  }

  async function signOutAction() {
    "use server";
    await signOut();
  }

  return (
    <AdminShell 
      user={{ name: user.name, image: user.image }} 
      logo={logoBlueiy}
      signOutAction={signOutAction}
    >
      {children}
    </AdminShell>
  );
}
