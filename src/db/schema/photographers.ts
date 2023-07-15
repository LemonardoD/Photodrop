import { int, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export type Photographers = InferModel<typeof photographers>;
export type NewPhotographer = InferModel<typeof photographers, "insert">;

export const photographers = mysqlTable(
    "photographers",
    {
        id: serial("id").primaryKey().notNull(),
        login: varchar("login", { length: 100 }).primaryKey().notNull(),
        password: varchar("password", { length: 100 }).notNull(),
        fullname: varchar("fullname", { length: 100 }),
        email: varchar("email", { length: 100 }),
        approved: int("approved").default(0),
    },
    (photographers) => ({
        login: uniqueIndex("login_UNIQUE").on(photographers.login),
        id: uniqueIndex("id_UNIQUE").on(photographers.id),
    })
);
