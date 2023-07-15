import { db } from "../db";
import { albums } from "../schema/albums";
import { eq } from "drizzle-orm/expressions";

export const getAlbumInfoByName = async function (albumName: string): Promise<boolean> {
    const inDB = await db.select().from(albums).where(eq(albums.albumName, albumName));
    if (!inDB) {
        return false;
    }
    return true;
};
