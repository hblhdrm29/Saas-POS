import postgres from 'postgres';
import 'dotenv/config';

async function checkConnection() {
    console.log("🔍 Mengecek koneksi ke database...");
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString || connectionString.includes('[YOUR-PASSWORD]')) {
        console.error("❌ Error: DATABASE_URL tidak valid atau masih menggunakan '[YOUR-PASSWORD]'");
        console.log(`Current URL: ${connectionString?.replace(/:([^@]+)@/, ":****@")}`);
        console.log("💡 Silakan ganti [YOUR-PASSWORD] di file .env dengan password database Supabase Anda.");
        return;
    }

    const sql = postgres(connectionString, { max: 1 });

    try {
        const result = await sql`SELECT 1 + 1 AS result`;
        if (result && result[0].result === 2) {
            console.log("✅ Berhasil! Database tersambung dengan sukses.");
        }
    } catch (error) {
        const err = error as Error;
        console.error("❌ Gagal menyambung ke database:");
        console.error(`Pesan Error: ${err.message}`);
    } finally {
        await sql.end();
    }
}

checkConnection();
