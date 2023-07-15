import { db } from "../db";
import { and, eq, like } from "drizzle-orm/expressions";
import { imageT } from "../schema/image";
import { albums } from "../schema/albums";
import { PhotosInfo, AllPhotosFromDB } from "../../controllers/types";

class ImageRepo {
    async getAllImgWOWtr(albumName: string, phone: string): Promise<PhotosInfo> {
        const finalRes = await db
            .select({
                album: imageT.album,
                alDate: albums.date,
                path: imageT.path,
                resizedPath: imageT.resizerpath,
                phId: imageT.id,
            })
            .from(imageT)
            .leftJoin(albums, eq(albums.albumName, imageT.album))
            .where(and(like(imageT.client, `%${phone}%`), eq(imageT.album, albumName)));
        return finalRes[0];
    }

    async getAllImgWWtr(albumName: string, phone: string): Promise<PhotosInfo> {
        const finalRes = await db
            .select({
                album: imageT.album,
                alDate: albums.date,
                path: imageT.wtrpath,
                resizedPath: imageT.reswtrmpath,
                phId: imageT.id,
            })
            .from(imageT)
            .leftJoin(albums, eq(albums.albumName, imageT.album))
            .where(and(like(imageT.client, `%${phone}%`), eq(imageT.album, albumName)));
        return finalRes[0];
    }

    async getImagesByPhone(phone: string): Promise<AllPhotosFromDB[]> {
        return await db
            .select({
                album: imageT.album,
                path: imageT.path,
                pathWtr: imageT.wtrpath,
                resizedPath: imageT.resizerpath,
                resizedPathWtr: imageT.reswtrmpath,
                PhId: imageT.id,
            })
            .from(imageT)
            .where(like(imageT.client, `%${phone}%`));
    }

    async getImagesByAlNameAndClient(albumName: string, phone: string): Promise<AllPhotosFromDB[]> {
        return await db
            .select({
                album: imageT.album,
                alDate: albums.date,
                path: imageT.path,
                pathWtr: imageT.wtrpath,
                resizedPath: imageT.resizerpath,
                resizedPathWtr: imageT.reswtrmpath,
                PhId: imageT.id,
            })
            .from(imageT)
            .leftJoin(albums, eq(albums.albumName, imageT.album))
            .where(and(like(imageT.client, `%${phone}%`), eq(imageT.album, albumName)));
    }

    async getImgNumberByAlbum(albumName: string) {
        const imgNum = await db.select().from(imageT).where(eq(imageT.album, albumName));
        return imgNum.length;
    }

    async getImageById(id: number) {
        return await db.select().from(imageT).where(eq(imageT.id, id));
    }
}

export default new ImageRepo();
