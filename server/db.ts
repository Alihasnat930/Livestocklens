import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL not set. Database features will be limited. Set DATABASE_URL to enable full functionality.",
  );
}

// Create pool with fallback for missing DATABASE_URL
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pool ? drizzle(pool, { schema }) : null;
