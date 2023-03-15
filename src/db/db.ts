import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

export const poolConnection = mysql.createPool({
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string
}); // my sql DB connection

export const db = drizzle(poolConnection);
