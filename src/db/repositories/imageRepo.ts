import { db } from "../db";
import { eq, like } from "drizzle-orm/expressions";
import { NewImage, image } from "../schema/image";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

class ImgRepo {
    async getImageByAlbum(albumName: string) {
        return await db.select().from(image).where(eq(image.album, albumName));
    }

    async getImageById(id: number) {
        return await db.select().from(image).where(eq(image.id, id));
    }

    async getImageByLikeText(text: string) {
        const dbImage = await db
            .select()
            .from(image)
            .where(like(image.imgname, `%${text}%`));
        return dbImage[0];
    }

    async insertImage(newImage: NewImage): Promise<MySqlRawQueryResult> {
        return await db.insert(image).values(newImage);
    }

    async addClientsToImage(id: number, clients: string) {
        return await db.update(image).set({ client: clients }).where(eq(image.id, id));
    }
}

export default new ImgRepo();
