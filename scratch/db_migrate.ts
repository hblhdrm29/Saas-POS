import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

async function migrate() {
    console.log('Connecting to database...');
    const sql = postgres(connectionString, { prepare: false });
    
    try {
        console.log('Executing migration: ALTER TABLE "products" ADD COLUMN "image" text;');
        // Running both statements from the generated migration file
        await sql`ALTER TABLE "shifts" ALTER COLUMN "starting_cash" DROP NOT NULL;`;
        await sql`ALTER TABLE "products" ADD COLUMN "image" text;`;
        console.log('Migration successful!');
    } catch (error) {
        const err = error as Error;
        if (err.message.includes('already exists')) {
            console.log('Column "image" already exists, skipping...');
        } else {
            console.error('Migration failed:', err);
        }
    } finally {
        await sql.end();
        process.exit();
    }
}

migrate();
