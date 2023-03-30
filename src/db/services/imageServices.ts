import { db } from "../db";
import { and, eq, like } from "drizzle-orm/expressions";
import { imageT } from "../schema/image";
import { albums } from "../schema/albums";
import { InferModel } from "drizzle-orm/mysql-core/table";

export type Image = InferModel<typeof imageT>;

export const getImagesWOdate = function (phone: string) {
    return db.select({
        album : imageT.album,
        pathW: imageT.wtrpath,
        path: imageT.path,
        pathWr: imageT.reswtrmpath,
        pathr: imageT.resizerpath,
        id: imageT.id
    }).from(imageT).where(and(like(imageT.client, `%${phone}%`)))
};

export const getImagesWdate = function (albumName:string, phone: string) {
    return db.select({
        album : imageT.album,
        pathW: imageT.wtrpath,
        path: imageT.path,
        pathWr: imageT.reswtrmpath,
        pathr: imageT.resizerpath,
        id: imageT.id,
        date: albums.date}).from(imageT)
        .leftJoin(albums, eq(albums.albumname, imageT.album))
        .where(and(like(imageT.client, `%${phone}%`), eq(imageT.album, albumName)))
};

export const getImageByAlbum = function (albumName: string) {
    return db.select().from(imageT).where(eq(imageT.album, albumName));
};

export const getImageById = function (id: number) {
    return db.select().from(imageT).where(eq(imageT.id, id));
};
