import { int, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const tableFVerify = mysqlTable("verify", {
    id: serial("id").primaryKey().notNull(),
    telegramid: varchar("telegramid", { length: 50 }),
    verifycode: varchar("verifycode", { length: 45 }),
    timestamp: int("timestamp"),
    trycount: int("trycount"),
    phone: varchar("phone", { length: 70 })
    }
);