import { db } from "@/db";
import { promotions } from "@/db/schema";
import { auth } from "@/auth";
import { eq, desc } from "drizzle-orm";
import PromotionManager from "./_components/PromotionManager";

export default async function PromotionsPage() {
    const session = await auth();
    const user = session?.user as any;

    const initialPromotions = await db
        .select()
        .from(promotions)
        .where(eq(promotions.tenantId, user.tenantId))
        .orderBy(desc(promotions.createdAt));

    return <PromotionManager initialPromotions={initialPromotions} />;
}
