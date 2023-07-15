import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { NewPhotographer, Photographers, photographers } from "../schema/photographers";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { PhotographersDB } from "../../DTO/dbDTO";

class PhotographersRepo {
    async getPhotographerByLogin(login: string) {
        const ph = await db.select().from(photographers).where(eq(photographers.login, login));
        return ph[0];
    }

    async getPhotographers(): Promise<PhotographersDB[]> {
        const allPhotographers = await db.select().from(photographers);
        return allPhotographers.map(function (el: Photographers) {
            return { login: el.login, fullName: el.fullname, email: el.email, approved: el.approved };
        });
    }

    async insertPhotographer(photographer: NewPhotographer): Promise<MySqlRawQueryResult> {
        return db.insert(photographers).values(photographer);
    }

    async approvePhotographer(photographer: string) {
        return db.update(photographers).set({ approved: 1 }).where(eq(photographers.login, photographer));
    }
}

export default new PhotographersRepo();
