import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '@shared/schema';

// Initialize the Postgres client with the DATABASE_URL environment variable
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

// For query execution
export const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// Run migrations (uncomment when needed)
// async function runMigrations() {
//   try {
//     await migrate(db, { migrationsFolder: './drizzle' });
//     console.log('Migrations completed successfully');
//   } catch (error) {
//     console.error('Error running migrations:', error);
//   }
// }

// Immediately invoke async function to run migrations if needed
// (async () => {
//   await runMigrations();
// })();