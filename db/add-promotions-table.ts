import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("⏳ Manually creating promotions table...");
  
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "promotions" (
          "id" serial PRIMARY KEY NOT NULL,
          "tenant_id" uuid NOT NULL,
          "name" varchar(255) NOT NULL,
          "code" varchar(100) NOT NULL,
          "type" varchar(50) NOT NULL,
          "value" decimal(12, 2) NOT NULL,
          "min_order" decimal(12, 2) DEFAULT '0' NOT NULL,
          "max_discount" decimal(12, 2),
          "quota" integer NOT NULL,
          "used" integer DEFAULT 0 NOT NULL,
          "expiry" timestamp NOT NULL,
          "active" boolean DEFAULT true NOT NULL,
          "created_at" timestamp DEFAULT now() NOT NULL,
          "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS "promo_code_tenant_idx" ON "promotions" ("tenant_id", "code");
    `);

    try {
      await db.execute(sql`
        ALTER TABLE "promotions" 
        ADD CONSTRAINT "promotions_tenant_id_tenants_id_fk" 
        FOREIGN KEY ("tenant_id") 
        REFERENCES "tenants"("id") 
        ON DELETE cascade 
        ON UPDATE no action;
      `);
    } catch {
      console.log("Note: Foreign key might already exist, skipping constraint creation.");
    }

    console.log("✅ Promotions table ensured!");
  } catch (error) {
    console.error("❌ Failed to create table:", error);
  } finally {
    process.exit(0);
  }
}

main();
