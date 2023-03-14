import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";
import { date, float, serial, varchar } from "drizzle-orm/mysql-core/columns";
import { index, uniqueIndex } from "drizzle-orm/mysql-core/indexes";

export const albums = mysqlTable("albums", {
    id: serial("id").notNull(),
    albumname: varchar("albumname", { length: 100 }).primaryKey().notNull(),
    albumlocation: varchar("albumlocation", { length: 100 }).notNull(),
    date: date("date").notNull(),
    mainphoto: varchar("mainphoto", { length: 255 }),
    price: float("price").notNull(),
    },
    (albums) => ({
        mainphoto: index("pth_idx").on(albums.mainphoto),
        albumname: uniqueIndex("albumname_UNIQUE").on(albums.albumname),
        id: uniqueIndex("id_UNIQUE").on(albums.id),
    })
);

export type Album = InferModel<typeof albums>;