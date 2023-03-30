import { db } from "../db";
import { albums } from "../schema/albums";
import { eq } from "drizzle-orm/expressions";
import { image } from "../schema/image";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Album = InferModel<typeof albums>;
export type NewAlbum = InferModel<typeof albums, 'insert'>;

export async function getAlbumInfo(albumName: string) {
    return await db.select().from(albums).where(eq(albums.albumname, albumName));
};

export async function getSpecificAl(albumName: string) {
    const result = await db.select({
        albumid: albums.id,
        albumname: albums.albumname,
        albumlocation: albums.albumlocation,
        albumdate: albums.date,
        photo: image.path,
        clients:image.client,
        photoid: image.id
    }).from(albums).leftJoin(image, eq(image.album, albumName)).where(eq(albums.albumname, albumName))
    return result.map(function(el) {
        if(el.photo === null || el.photoid === null) {
            return null
        } else if(el.clients === null) {
            return {id: el.albumid, albumname: el.albumname, albumlocation: el.albumlocation, albumdate: el.albumdate,
                photo: el.photo, idphoto: el.photoid}
        } else {
            return {id: el.albumid, albumname: el.albumname, albumlocation: el.albumlocation, albumdate: el.albumdate,
                photo: el.photo, clients: el.clients, idphoto: el.photoid}
        }
    })
};

export async function getAlbums() {
    return db.select().from(albums)
};

export async function insertAlbum(album: NewAlbum): Promise<MySqlRawQueryResult> {
    return db.insert(albums).values(album);
};

export async function updateAlbumPrice(album: string, price: number): Promise<MySqlRawQueryResult> {
    return  db.update(albums).set({ price: price}).where(eq(albums.albumname, album));
};

export async function updateMainPhoto(album: string, mainphoto: string) {
    return  db.update(albums).set({ mainphoto: mainphoto}).where(eq(albums.albumname, album));
};