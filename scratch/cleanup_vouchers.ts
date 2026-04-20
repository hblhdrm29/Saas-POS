import postgres from 'postgres';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in .env');
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function cleanup() {
  console.log('🗑️ Starting database cleanup...');
  
  try {
    // 1. Drop foreign key constraint first if it still exists
    try {
        console.log('Dropping foreign key...');
        await sql`ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_promotion_id_promotions_id_fk"`;
    } catch (e) {
        console.log('FK drop note:', e);
    }

    // 2. Drop promotion_id column from transactions
    try {
        console.log('Dropping promotion_id column...');
        await sql`ALTER TABLE "transactions" DROP COLUMN IF EXISTS "promotion_id"`;
    } catch (e) {
        console.log('Column drop note:', e);
    }

    // 3. Drop promotions table
    try {
        console.log('Dropping promotions table...');
        await sql`DROP TABLE IF EXISTS "promotions" CASCADE`;
    } catch (e) {
        console.log('Table drop note:', e);
    }

    console.log('✅ Base Database cleanup successful!');
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
  } finally {
    await sql.end();
  }
}

cleanup();
