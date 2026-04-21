import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import "dotenv/config"; // Important to read .env file

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not provided in .env");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Starting Database Seeding...");

  try {
    // 1. Create a Tenant
    console.log("➡️ Seeding Tenant...");
    const [tenant] = await db.insert(schema.tenants).values({
      name: "Toko Utama (Cabang Jakarta)",
    }).returning();
    console.log(`✅ Tenant Created: ${tenant.name} (${tenant.id})`);

    // 2. Create Users
    console.log("➡️ Seeding Users...");
    await db.insert(schema.users).values({
      tenantId: tenant.id,
      name: "Budi Admin",
      email: "admin@tokoutama.com",
      passwordHash: "rahasia123", // Real app would use bcrypt here
      role: "ADMIN"
    });

    await db.insert(schema.users).values({
      tenantId: tenant.id,
      name: "Siti Kasir",
      email: "kasir@tokoutama.com",
      passwordHash: "rahasia123",
      role: "CASHIER"
    });
    console.log("✅ Users Created (admin@tokoutama.com & kasir@tokoutama.com)");

    // 3. Create Categories
    console.log("➡️ Seeding Categories...");
    const [catDrinks] = await db.insert(schema.categories).values({
      tenantId: tenant.id,
      name: "Minuman Dingin"
    }).returning();

    const [catFood] = await db.insert(schema.categories).values({
      tenantId: tenant.id,
      name: "Cemilan"
    }).returning();
    console.log("✅ Categories Created");

    // 4. Create Products
    console.log("➡️ Seeding Products...");
    await db.insert(schema.products).values([
      {
        tenantId: tenant.id,
        categoryId: catDrinks.id,
        sku: "DRINK-001",
        name: "Es Kopi Susu Gula Aren",
        price: "18000.00",
        stock: 50,
        isActive: true
      },
      {
        tenantId: tenant.id,
        categoryId: catDrinks.id,
        sku: "DRINK-002",
        name: "Iced Matcha Latte",
        price: "24000.00",
        stock: 30,
        isActive: true
      },
      {
        tenantId: tenant.id,
        categoryId: catFood.id,
        sku: "FOOD-001",
        name: "Kentang Goreng",
        price: "15000.00",
        stock: 100,
        isActive: true
      },
      {
        tenantId: tenant.id,
        categoryId: catFood.id,
        sku: "FOOD-002",
        name: "Nasi Goreng Spesial",
        price: "28000.00",
        stock: 20,
        isActive: true
      }
    ]);
    console.log("✅ Products Created");

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.end();
  }
}

seed();
