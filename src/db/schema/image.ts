import { serial, tinyint, varchar } from "drizzle-orm/mysql-core/columns";
import { foreignKey } from "drizzle-orm/mysql-core/foreign-keys";
import { albums } from "./albums";
import { index, uniqueIndex } from "drizzle-orm/mysql-core/indexes";
import { InferModel, mysqlTable } from "drizzle-orm/mysql-core/table";

export type Image = InferModel<typeof image>;
export type NewImage = InferModel<typeof image, "insert">;

export const image = mysqlTable(
    "image",
    {
        id: serial("id").primaryKey().notNull(),
        album: varchar("album", { length: 100 }).primaryKey(),
        imgname: varchar("imgname", { length: 255 }).primaryKey().notNull(),
        path: varchar("path", { length: 255 }).notNull(),
        inbucket: tinyint("inbucket").notNull(),
        wtrpath: varchar("wtrpath", { length: 255 }).notNull(),
        client: varchar("client", { length: 255 }),
        resizerpath: varchar("resizerpath", { length: 255 }).notNull(),
        reswtrmpath: varchar("reswtrmpath", { length: 255 }).notNull(),
    },
    (image) => ({
        alb: foreignKey({
            columns: [image.album],
            foreignColumns: [albums.albumName],
        }),
        alb_idx: index("pth_idx").on(image.path),
        path: uniqueIndex("path_UNIQUE").on(image.path),
        wtrpath: uniqueIndex("wtrpath_UNIQUE").on(image.wtrpath),
    })
);
