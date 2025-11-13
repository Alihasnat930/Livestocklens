import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    console.log('🔄 Starting blockchain fields migration...');
    
    const migrationSQL = readFileSync(
      join(__dirname, 'add_blockchain_fields.sql'),
      'utf-8'
    );

    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Added blockchain fields:');
    console.log('   - cattle.blockchain_tx_hash (TEXT)');
    console.log('   - cattle.blockchain_registered (BOOLEAN)');
    console.log('   - cattle.owner_cnic (TEXT)');
    console.log('   - vaccinations.blockchain_tx_hash (TEXT)');
    console.log('   - Created performance indexes');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigration();
