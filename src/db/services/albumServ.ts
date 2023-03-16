import { db } from "../db";
import { albums } from "../schema/albums";
import { eq } from "drizzle-orm/expressions";
import { image } from "../schema/image";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Album = InferModel<typeof albums>;
export type NewAlbum = InferModel<typeof albums, 'insert'>;

export const getAlbumInfo = async function (albumName: string) {
    return await db.select().from(albums).where(eq(albums.albumname, albumName));
};

export const getSpecificAl = async function (albumName: string) {
    return await db.select({
        albumid: albums.id,
        albumname: albums.albumname,
        albumlocation: albums.albumlocation,
        albumdate: albums.date,
        photo: image.path,
        clients:image.client,
        photoid: image.id
      }).from(albums).leftJoin(image, eq(image.album, albumName)).where(eq(albums.albumname, albumName))
};

export const getAlbums = async function () {
    return await db.select().from(albums)
};

export async function insertAlbum(album: NewAlbum): Promise<MySqlRawQueryResult> {
    return db.insert(albums).values(album);
};
