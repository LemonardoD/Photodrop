import { serial, varchar } from "drizzle-orm/mysql-core/columns";
import { foreignKey } from "drizzle-orm/mysql-core/foreign-keys";
import { index } from "drizzle-orm/mysql-core/indexes";
import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { users } from "./users";
import { albums } from "./albums";

export const payedalbums = mysqlTable("payedalbums", {
    id_payment: serial("id_payment").primaryKey().notNull(),
    payedalbum: varchar("payedalbum", { length: 100 }).notNull(),
    payedphone: varchar("payedphone", { length: 70 }).notNull(),
    payedphoto: varchar("payedphoto", { length: 100 }),
    },
    (payedalbums) => ({
        payment_alb: foreignKey(({
            columns: [payedalbums.payedalbum],
            foreignColumns: [albums.albumname],
        })),
        payment_usr: foreignKey(({
            columns: [payedalbums.payedphone],
            foreignColumns: [users.phone],
        })),
        alb_idx: index("alb_idx").on(payedalbums.payedalbum),
        usr_idx: index("usr_idx").on(payedalbums.payedphone),
    })
);