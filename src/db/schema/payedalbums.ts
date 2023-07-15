import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";
import { albums } from "./albums";
import { users } from "./users";
import { serial, varchar } from "drizzle-orm/mysql-core/columns";
import { foreignKey } from "drizzle-orm/mysql-core/foreign-keys";
import { index } from "drizzle-orm/mysql-core/indexes";

export type PayedAlbum = InferModel<typeof payedAlbums>;
export type NewPayedAlbum = InferModel<typeof payedAlbums, "insert">;

export const payedAlbums = mysqlTable(
    "payedalbums",
    {
        id_payment: serial("id_payment").primaryKey().notNull(),
        payedAlbum: varchar("payedAlbum", { length: 100 }).notNull(),
        payedPhone: varchar("payedPhone", { length: 70 }).notNull(),
        payedPhoto: varchar("payedPhoto", { length: 100 }),
    },
    (payedAlbums) => ({
        payment_alb: foreignKey({
            columns: [payedAlbums.payedAlbum],
            foreignColumns: [albums.albumName],
        }),
        payment_usr: foreignKey({
            columns: [payedAlbums.payedPhone],
            foreignColumns: [users.phone],
        }),
        alb_idx: index("alb_idx").on(payedAlbums.payedAlbum),
        usr_idx: index("usr_idx").on(payedAlbums.payedPhone),
    })
);
