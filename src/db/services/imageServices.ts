import { db } from "../db";
import { eq, like } from "drizzle-orm/expressions";
import { image } from "../schema/image";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Image = InferModel<typeof image>;
export type NewImage = InferModel<typeof image, 'insert'>; 

export async function getImageByAlbum (albumName: string) {
    return await db.select().from(image).where(eq(image.album, albumName));
};

export async function getImageById (id: number) {
    return await db.select().from(image).where(eq(image.id, id));
};

export async function getImageByLikeText (text: string) {
    return await db.select().from(image).where(like(image.imgname, `%${text}%`));
};

export async function insertImage(newimage: NewImage): Promise<MySqlRawQueryResult> {
    return db.insert(image).values(newimage);
};

export async function addClients (id: number, clients: string) {
    return db.update(image).set({ client: clients}).where(eq(image.id, id));
};
