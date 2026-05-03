import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryString = process.env.DATABASE_URL;

if (!queryString) {
    throw new Error('DATABASE_URL is not defined');
}

export const connection = postgres(queryString, {
    ssl: false, // Disable SSL for local development
});

export const db = drizzle(connection);

