import "dotenv/config";
import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("⏳ Enabling Supabase Realtime for transactions table...");
  
  try {
    // 1. Ensure the publication exists (usually does in Supabase)
    // 2. Add the table to the publication
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
          CREATE PUBLICATION supabase_realtime;
        END IF;
      END $$;
    `);

    await db.execute(sql`
      ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
    `);

    console.log("✅ Realtime enabled for transactions!");
  } catch (error) {
    const err = error as Error;
    if (err.message?.includes("already exists in publication")) {
      console.log("ℹ️ Table 'transactions' is already in the Realtime publication.");
    } else {
      console.error("❌ Failed to enable Realtime:", err);
    }
  } finally {
    process.exit(0);
  }
}

main();
