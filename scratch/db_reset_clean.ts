import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

async function resetDatabase() {
    const sql = postgres(connectionString, { prepare: false });
    
    try {
        console.log('--- Reseting Data & IDs (RESTART IDENTITY) ---');
        
        // Truncate tables and restart their identity sequences
        // Note: ORDER IS IMPORTANT due to Foreign Keys
        console.log('Clearing Transactions & Logs...');
        await sql`TRUNCATE TABLE transaction_items, transactions, stock_logs, void_logs RESTART IDENTITY CASCADE`;
        
        console.log('Clearing Products & Categories...');
        await sql`TRUNCATE TABLE products, categories RESTART IDENTITY CASCADE`;

        console.log('SUCCESS: Database has been cleaned and IDs reset to 1!');
        
    } catch (error) {
        console.error('Error during reset:', error);
    } finally {
        await sql.end();
        process.exit();
    }
}

resetDatabase();
