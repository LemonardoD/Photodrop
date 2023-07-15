import { db } from "../db";
import { NewAlbum, albums } from "../schema/albums";
import { eq } from "drizzle-orm/expressions";
import { image } from "../schema/image";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { Albums, SpecificAlbum } from "../../DTO/dbDTO";

class AlbumRepo {
    async getAlbumByName(albumName: string) {
        const album = await db.select().from(albums).where(eq(albums.albumName, albumName));
        return album[0];
    }

    async getSpecificAlbum(albumName: string): Promise<SpecificAlbum> {
        const result = await db
            .select({
                albumId: albums.id,
                albumName: albums.albumName,
                albumLocation: albums.albumLocation,
                albumDate: albums.date,
                photo: image.path,
                clients: image.client,
                photoId: image.id,
            })
            .from(albums)
            .leftJoin(image, eq(image.album, albumName))
            .where(eq(albums.albumName, albumName));
        return result[0];
    }

    async getAlbums(): Promise<Albums[]> {
        return await db
            .select({
                albumId: albums.id,
                albumName: albums.albumName,
                albumLocation: albums.albumLocation,
                albumDate: albums.date,
                mainPhoto: albums.mainPhoto,
                price: albums.price,
            })
            .from(albums);
    }

    async insertAlbum(album: NewAlbum): Promise<MySqlRawQueryResult> {
        return await db.insert(albums).values(album);
    }

    async updateAlbumPrice(album: string, price: number): Promise<MySqlRawQueryResult> {
        return await db.update(albums).set({ price: price }).where(eq(albums.albumName, album));
    }

    async updateAlbumMainPhoto(album: string, mainPhoto: string) {
        return await db.update(albums).set({ mainPhoto: mainPhoto }).where(eq(albums.albumName, album));
    }
}

export default new AlbumRepo();
