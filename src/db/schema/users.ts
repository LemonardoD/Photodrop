import { int, serial, tinyint, varchar } from "drizzle-orm/mysql-core/columns";
import { uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";
import { db } from "../db";


export const users = mysqlTable("users", {
    id: serial("id").primaryKey().notNull(),
    phone: varchar("phone", { length: 70 }).primaryKey().notNull(),
    selfiepath: varchar("selfiepath", { length: 255 }),
    fullname: varchar("fullname", { length: 50 }),
    telebotnum: int("telebotnum"),
    phoneisveryfied: tinyint("phoneisveryfied"),
    email: varchar("email", { length: 100 }),
    accesstoken: varchar("accesstoken", { length: 255 }),
    refreshtoken: varchar("refreshtoken", { length: 255 }),
    phonenotif: tinyint("phonenotif"),
    emailnotif: tinyint("emailnotif"),
    unsubscribenotif: tinyint("unsubscribenotif")
},
    (users) => ({
        username_UNIQUE: uniqueIndex("username_UNIQUE").on(users.phone),
        email_UNIQUE: uniqueIndex("email_UNIQUE").on(users.email),
    })
);

export type User = InferModel<typeof users>;