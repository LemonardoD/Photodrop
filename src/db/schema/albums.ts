import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";
import { date, float, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { index, uniqueIndex } from "drizzle-orm/mysql-core/indexes";

export type Album = InferModel<typeof albums>;

export const albums = mysqlTable(
    "albums",
    {
        id: serial("id").notNull(),
        albumName: varchar("albumName", { length: 100 }).primaryKey().notNull(),
        albumLocation: varchar("albumLocation", { length: 100 }).notNull(),
        date: date("date").notNull(),
        mainPhoto: varchar("mainPhoto", { length: 255 }),
        price: float("price").notNull(),
    },
    (albums) => ({
        mainPhoto: index("pth_idx").on(albums.mainPhoto),
        albumName: uniqueIndex("albumname_UNIQUE").on(albums.albumName),
        id: uniqueIndex("id_UNIQUE").on(albums.id),
    })
);
