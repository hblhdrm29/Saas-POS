import { pgTable, serial, text, timestamp, integer, boolean, varchar, uuid, decimal, uniqueIndex } from "drizzle-orm/pg-core";

// Base tenant schema for SaaS
export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  receiptHeader: text("receipt_header"),
  receiptFooter: text("receipt_footer"),
  lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users handling (compatible with NextAuth)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: varchar("role", { length: 50 }).default('CASHIER').notNull(), // 'ADMIN' or 'CASHIER'
  shift: varchar("shift", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// Promotions & Vouchers
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 100 }).notNull(), // e.g. 'DISKON10'
  type: varchar("type", { length: 50 }).notNull(), // 'PERCENTAGE', 'NOMINAL'
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  minTransaction: decimal("min_transaction", { precision: 12, scale: 2 }).default("0").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Shifts & Cash Control
export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  startingCash: decimal("starting_cash", { precision: 12, scale: 2 }).default("0"),
  totalSalesCash: decimal("total_sales_cash", { precision: 12, scale: 2 }).default("0").notNull(),
  actualCash: decimal("actual_cash", { precision: 12, scale: 2 }), // input by user at end
  status: varchar("status", { length: 50 }).default('OPEN').notNull(), // 'OPEN', 'CLOSED'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products & Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  lowStockThreshold: integer("low_stock_threshold").default(5).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
  return {
    skuTenantUniqueIdx: uniqueIndex("sku_tenant_unique_idx").on(table.tenantId, table.sku),
  }
});

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  promotionId: integer("promotion_id").references(() => promotions.id, { onDelete: "set null" }),
  shiftId: integer("shift_id").references(() => shifts.id, { onDelete: "set null" }),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }).notNull(), // 'CASH', 'CARD', 'QRIS'
  status: varchar("status", { length: 50 }).default('COMPLETED').notNull(), // 'COMPLETED', 'VOID', 'REFUNDED'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transaction Items
export const transactionItems = pgTable("transaction_items", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Parked Orders (Hold Orders)
export const parkedOrders = pgTable("parked_orders", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  customerName: varchar("customer_name", { length: 255 }), // Temporary name for parked order
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const parkedOrderItems = pgTable("parked_order_items", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  parkedOrderId: integer("parked_order_id").references(() => parkedOrders.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Inventory Audit & Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stockLogs = pgTable("stock_logs", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'RECEIVED', 'REDUCED', 'VOID', 'ADJUSTMENT'
  quantity: integer("quantity").notNull(),
  referenceId: varchar("reference_id", { length: 100 }), // PO number or Transaction ID
  notes: text("notes"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Void Logs (specifically for tracking deleted/voided items or transactions)
export const voidLogs = pgTable("void_logs", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  transactionId: integer("transaction_id"),
  productId: integer("product_id"),
  reason: text("reason").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
