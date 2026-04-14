import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not provided in .env");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client);

async function runMigrate() {
  console.log("⏳ Running migrations...");
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log("✅ Migrations complete!");
  } catch (error) {
    console.error("❌ Error running migrations:", error);
  } finally {
    await client.end();
  }
}

runMigrate();
