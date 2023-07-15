import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = <
    { DB_HOST: string; DB_PORT: string; DB_USER: string; DB_PASSWORD: string; DB_NAME: string }
>process.env;
export const poolConnection = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
}); // my sql DB connection

export const db = drizzle(poolConnection);
