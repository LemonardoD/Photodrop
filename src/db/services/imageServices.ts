import { db } from "../db";
import { eq, like } from "drizzle-orm/expressions";
import { image } from "../schema/image";

export const getImageByAlbum = async function (albumName: string) {
    return await db.select().from(image).where(eq(image.album, albumName));
};

export const getImageById = async function (id: number) {
    return await db.select().from(image).where(eq(image.id, id));
};

export const getImageByLikeText = async function (text: string) {
    return await db.select().from(image).where(like(image.imgname, `%${text}%`));
};

