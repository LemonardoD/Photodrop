import { db } from "../db";
import { eq, like } from "drizzle-orm/expressions";
import { image } from "../schema/image";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Image = InferModel<typeof image>;
export type NewImage = InferModel<typeof image, 'insert'>; 

export const getImageByAlbum = async function (albumName: string) {
    return await db.select().from(image).where(eq(image.album, albumName));
};

export const getImageById = async function (id: number) {
    return await db.select().from(image).where(eq(image.id, id));
};

export const getImageByLikeText = async function (text: string) {
    return await db.select().from(image).where(like(image.imgname, `%${text}%`));
};

export async function insertImage(newimage: NewImage): Promise<MySqlRawQueryResult> {
    return db.insert(image).values(newimage);
};