import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function repair() {
    console.log("🛠️ Starting database repair...");
    
    try {
        // 1. Remove CRM References
        console.log("- Dropping CRM table if exists...");
        await sql`DROP TABLE IF EXISTS "customers" CASCADE;`;
        
        console.log("- Removing customer_id column from transactions...");
        await sql`ALTER TABLE "transactions" DROP COLUMN IF EXISTS "customer_id";`;

        // 2. Add Missing Columns safely
        console.log("- Ensuring missing columns exist...");
        
        // Shifts notes
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shifts' AND column_name='notes') THEN
                    ALTER TABLE "shifts" ADD COLUMN "notes" text;
                END IF;
            END $$;
        `;

        // Shifts starting_cash update
        await sql`ALTER TABLE "shifts" ALTER COLUMN "starting_cash" DROP NOT NULL;`;
        await sql`ALTER TABLE "shifts" ALTER COLUMN "starting_cash" SET DEFAULT '0';`;

        // Tenants branding
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='receipt_header') THEN
                    ALTER TABLE "tenants" ADD COLUMN "receipt_header" text;
                END IF;
            END $$;
        `;
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tenants' AND column_name='receipt_footer') THEN
                    ALTER TABLE "tenants" ADD COLUMN "receipt_footer" text;
                END IF;
            END $$;
        `;

        // Transaction improvements
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='discount_amount') THEN
                    ALTER TABLE "transactions" ADD COLUMN "discount_amount" numeric(12, 2) DEFAULT '0' NOT NULL;
                END IF;
            END $$;
        `;
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='tax_amount') THEN
                    ALTER TABLE "transactions" ADD COLUMN "tax_amount" numeric(12, 2) DEFAULT '0' NOT NULL;
                END IF;
            END $$;
        `;
        await sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='shift_id') THEN
                    ALTER TABLE "transactions" ADD COLUMN "shift_id" integer;
                END IF;
            END $$;
        `;

        // 3. Create missing tables if they don't exist
        console.log("- Creating secondary tables...");
        await sql`
            CREATE TABLE IF NOT EXISTS "promotions" (
                "id" serial PRIMARY KEY NOT NULL,
                "tenant_id" uuid NOT NULL,
                "code" varchar(100) NOT NULL,
                "type" varchar(50) NOT NULL,
                "value" numeric(12, 2) NOT NULL,
                "min_transaction" numeric(12, 2) DEFAULT '0' NOT NULL,
                "is_active" boolean DEFAULT true NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS "stock_logs" (
                "id" serial PRIMARY KEY NOT NULL,
                "tenant_id" uuid NOT NULL,
                "product_id" integer NOT NULL,
                "type" varchar(50) NOT NULL,
                "quantity" integer NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `;

        console.log("✅ Repair complete!");
    } catch (e) {
        console.error("❌ Repair failed:", e);
    } finally {
        await sql.end();
    }
}

repair();
