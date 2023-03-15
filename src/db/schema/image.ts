import { mysqlTable } from "drizzle-orm/mysql-core/table";
import { albums } from "./albums";
import { serial, tinyint, varchar } from "drizzle-orm/mysql-core/columns";
import { foreignKey } from "drizzle-orm/mysql-core/foreign-keys";
import { index, uniqueIndex } from "drizzle-orm/mysql-core/indexes";

export const imageT = mysqlTable("image", {
    id: serial("id").primaryKey().notNull(),
    album: varchar("album", { length: 100 }).primaryKey(),
    imgname: varchar("imgname", { length: 255 }).primaryKey().notNull(),
    path: varchar("path", { length: 255 }),
    inbucket: tinyint("inbucket").notNull(),
    wtrpath: varchar("wtrpath", { length: 255 }),
    client: varchar("client", { length: 255 }),
    resizerpath: varchar("resizerpath", { length: 255 }),
    reswtrmpath: varchar("reswtrmpath", { length: 255 }),
    },
    (imageT) => ({
        alb: foreignKey(({
            columns: [imageT.album],
            foreignColumns: [albums.albumname],
        })),
        alb_idx: index("pth_idx").on(imageT.path),
        path: uniqueIndex("path_UNIQUE").on(imageT.path),
        wtrpath: uniqueIndex("wtrpath_UNIQUE").on(imageT.wtrpath),
    })
);