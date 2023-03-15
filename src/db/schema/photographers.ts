import { int, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const photograpers = mysqlTable("photograpers", {
    id: serial("id").primaryKey().notNull(),
    login: varchar("login", { length: 100 }).primaryKey().notNull(),
    password: varchar("password", { length: 100 }).notNull(),
    fullname: varchar("fullname", { length: 100 }),
    email: varchar("email", { length: 100 }),
    accesstoken: varchar("accesstoken", { length: 255 }),
    refreshtoken: varchar("refreshtoken", { length: 255 }),
    aproved: int("aproved")},
    (photograpers) => ({
        login: uniqueIndex("login_UNIQUE").on(photograpers.login),
        id: uniqueIndex("id_UNIQUE").on(photograpers.id),
    })
);