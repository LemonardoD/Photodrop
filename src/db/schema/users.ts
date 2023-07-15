import { int, serial, tinyint, varchar } from "drizzle-orm/mysql-core/columns";
import { uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

export const users = mysqlTable(
    "users",
    {
        id: serial("id").primaryKey().notNull(),
        phone: varchar("phone", { length: 70 }).primaryKey().notNull(),
        selfiePath: varchar("selfiePath", { length: 255 }),
        fullname: varchar("fullname", { length: 50 }),
        telebotnum: int("telebotnum"),
        phoneIsVerified: tinyint("phoneisveryfied"),
        email: varchar("email", { length: 100 }),
        phoneNotif: tinyint("phoneNotif").notNull().default(0),
        emailNotif: tinyint("emailNotif").notNull().default(0),
        unsubscribeNotif: tinyint("unsubscribeNotif").notNull().default(0),
    },
    (users) => ({
        username_UNIQUE: uniqueIndex("username_UNIQUE").on(users.phone),
        email_UNIQUE: uniqueIndex("email_UNIQUE").on(users.email),
    })
);
