import { db } from "../db";
import { and, eq, like } from "drizzle-orm/expressions";
import { imageT } from "../schema/image";
import { albums } from "../schema/albums";

export const getImagesWOdate = async function (phone: string) {
    return await db.select({
        album : imageT.album,
        pathW: imageT.wtrpath,
        path: imageT.path,
        id: imageT.id
    }).from(imageT).where(and(like(imageT.client, `%${phone}%`)))
};

export const getImagesWdate = async function (albumName:string, phone: string) {
    return await db.select({
        album : imageT.album,
        pathW: imageT.wtrpath,
        path: imageT.path,
        id: imageT.id,
        date: albums.date}).from(imageT)
        .leftJoin(albums, eq(albums.albumname, imageT.album))
        .where(and(like(imageT.client, `%${phone}`), eq(imageT.album, albumName)))
};

export const getImageByAlbum = async function (albumName: string) {
    return await db.select().from(imageT).where(eq(imageT.album, albumName));
};

export const getImageById = async function (id: number) {
    return await db.select().from(imageT).where(eq(imageT.id, id));
};



