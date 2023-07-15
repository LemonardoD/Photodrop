import { int, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export type PhoneVerify = InferModel<typeof phVerify>;
export type NewPhoneVerify = InferModel<typeof phVerify, "insert">;

export const phVerify = mysqlTable("verify", {
    id: serial("id").primaryKey().notNull(),
    telegramId: varchar("telegramId", { length: 50 }),
    verifyCode: varchar("verifyCode", { length: 45 }),
    timestamp: int("timestamp"),
    tryCount: int("tryCount"),
    phone: varchar("phone", { length: 70 }),
});
