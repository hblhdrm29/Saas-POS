import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getPromotions } from "@/app/actions/promotion_actions";
import PromotionsClient from "./_components/PromotionsClient";

export default async function PromotionsPage() {
  const session = await auth();
  if (!session?.user?.tenantId || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch real data from database
  const initialVouchers = await getPromotions();

  return (
    <div className="space-y-8">
      <PromotionsClient initialData={initialVouchers} />
    </div>
  );
}
