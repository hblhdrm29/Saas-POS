import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import AdminShell from "./_components/AdminShell";

import logoBlueiy from "../assets/logo/blueiy_premium.png";



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
  const user = session.user;

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
      user={{ name: user.name ?? "User", image: user.image ?? undefined }} 
      logo={logoBlueiy}
      signOutAction={signOutAction}
    >
      {children}
    </AdminShell>
  );
}
