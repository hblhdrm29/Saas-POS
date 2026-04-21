"use server";

import { db } from "@/db";
import { transactions, transactionItems, products } from "@/db/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";
import { auth } from "@/auth";

/**
 * Get high-level dashboard metrics
 */
export async function getDashboardStats() {
  const session = await auth();
  const user = session?.user as { tenantId?: string } | null;
  if (!user?.tenantId) return null;

  const tenantId = user.tenantId;

  // 1. Total Revenue (Current Month)
  const revenueResult = await db
    .select({ total: sql<string>`sum(${transactions.totalAmount})` })
    .from(transactions)
    .where(eq(transactions.tenantId, tenantId));

  // 2. Total Transactions
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.tenantId, tenantId));

  // 3. Average Ticket
  const totalRev = parseFloat(revenueResult[0]?.total || "0");
  const totalCount = Number(countResult[0]?.count || 0);
  const avgTicket = totalCount > 0 ? totalRev / totalCount : 0;

  return {
    totalRevenue: totalRev,
    totalTransactions: totalCount,
    avgTicket: avgTicket,
  };
}

/**
 * Get weekly sales data for the Bar Chart
 */
export async function getWeeklySalesData() {
  const session = await auth();
  const user = session?.user as { tenantId?: string } | null;
  if (!user?.tenantId) return [];

  const tenantId = user.tenantId;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Group by day of week
  const results = await db
    .select({
      day: sql<string>`to_char(${transactions.createdAt}, 'DY')`,
      sales: sql<string>`sum(${transactions.totalAmount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.tenantId, tenantId),
        gte(transactions.createdAt, sevenDaysAgo)
      )
    )
    .groupBy(sql`to_char(${transactions.createdAt}, 'DY')`);

  const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Create a map for easy lookup
  const salesMap = results.reduce((acc: Record<string, number>, curr) => {
    acc[curr.day.trim().toUpperCase()] = parseFloat(curr.sales || "0");
    return acc;
  }, {});

  return dayOrder.map(day => ({
    name: day,
    sales: salesMap[day] || 0
  }));
}

/**
 * Get the latest 5 transactions for the Recent Sales widget
 */
export async function getRecentSales() {
  const session = await auth();
  const user = session?.user as { tenantId?: string } | null;
  if (!user?.tenantId) return [];

  const tenantId = user.tenantId;

  const recent = await db
    .select({
      id: transactions.id,
      total: transactions.totalAmount,
      createdAt: transactions.createdAt,
      paymentMethod: transactions.paymentMethod,
    })
    .from(transactions)
    .where(eq(transactions.tenantId, tenantId))
    .orderBy(desc(transactions.createdAt))
    .limit(5);

  return recent.map(t => ({
    id: `#${t.id}`,
    name: 'Transaction', // Placeholder as we don't store customer name in simple checkout
    time: t.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: `Rp ${parseFloat(t.total).toLocaleString('id-ID')}`,
    payment: t.paymentMethod,
    date: t.createdAt.toLocaleDateString('id-ID')
  }));
}

/**
 * Get products that are low in stock
 */
export async function getLowStockAlerts() {
  const session = await auth();
  const user = session?.user as { tenantId?: string } | null;
  if (!user?.tenantId) return [];

  const tenantId = user.tenantId;

  const lowStock = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.tenantId, tenantId),
        sql`${products.stock} <= ${products.lowStockThreshold}`
      )
    )
    .limit(3);

  return lowStock;
}
