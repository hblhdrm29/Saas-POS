import postgres from 'postgres';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function migrate() {
  console.log('🚀 Starting manual migration...');
  
  try {
    // These are the statements from drizzle/0002_steady_abomination.sql
    await sql`ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "name" varchar(255)`;
    await sql`ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "usage_limit" integer DEFAULT 0`;
    await sql`ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "is_customer_limited" boolean DEFAULT false NOT NULL`;
    await sql`ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "complimentary_product_id" integer`;
    await sql`ALTER TABLE "promotions" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL`;
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shift" varchar(50)`;
    
    // Add foreign key constraint (wrapped in try-catch in case it exists)
    try {
        await sql`ALTER TABLE "promotions" ADD CONSTRAINT "promotions_complimentary_product_id_products_id_fk" FOREIGN KEY ("complimentary_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action`;
    } catch (e) {
        console.log('Note: Constraint might already exist, skipping...');
    }

    // Add unique index (wrapped in try-catch in case it exists)
    try {
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS "sku_tenant_unique_idx" ON "products" ("tenant_id", "sku")`;
    } catch (e) {
        console.log('Note: Index might already exist, skipping...');
    }

    console.log('✅ Migration successful! Database is now in sync.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    await sql.end();
  }
}

migrate();
