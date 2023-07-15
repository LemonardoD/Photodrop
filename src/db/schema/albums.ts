import { date, float, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { index, uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export type Album = InferModel<typeof albums>;
export type NewAlbum = InferModel<typeof albums, "insert">;

export const albums = mysqlTable(
    "albums",
    {
        id: serial("id").notNull(),
        albumName: varchar("albumname", { length: 100 }).primaryKey().notNull(),
        albumLocation: varchar("albumlocation", { length: 100 }).notNull(),
        date: date("date").notNull(),
        mainPhoto: varchar("mainphoto", { length: 255 }),
        price: float("price").notNull(),
    },
    (albums) => ({
        mainphoto: index("pth_idx").on(albums.mainPhoto),
        albumname: uniqueIndex("albumname_UNIQUE").on(albums.albumName),
        id: uniqueIndex("id_UNIQUE").on(albums.id),
    })
);
