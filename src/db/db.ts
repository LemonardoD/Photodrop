import { drizzle } from 'drizzle-orm/mysql2';
import mysql from "mysql2/promise";

// create the connection
export const poolConnection = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: "david35221311972",
    database: 'framology'
});

export const db = drizzle(poolConnection);