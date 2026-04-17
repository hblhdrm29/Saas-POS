import "dotenv/config";
import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Adding 'shift' column to 'users' table...");
  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS shift VARCHAR(50);`);
    console.log("Column 'shift' added successfully!");
  } catch (error) {
    console.error("Failed to add column:", error);
  }
  process.exit(0);
}

main();
