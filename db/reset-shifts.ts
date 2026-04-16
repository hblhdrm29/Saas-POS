import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function resetShifts() {
    console.log("🧹 Resetting shifts...");
    try {
        const result = await sql`
            UPDATE "shifts" SET "status" = 'CLOSED', "end_time" = NOW() WHERE "status" = 'OPEN';
        `;
        console.log(`✅ ${result.count} shifts closed.`);
    } catch (e) {
        console.error("❌ Reset failed:", e);
    } finally {
        await sql.end();
    }
}

resetShifts();
