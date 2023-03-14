import { db } from "../db";
import { albums } from "../schema/albums";
import { eq } from "drizzle-orm/expressions";

export const getAlbumInfo = async function (albumName: string) {
    return await db.select().from(albums).where(eq(albums.albumname, albumName));
};


