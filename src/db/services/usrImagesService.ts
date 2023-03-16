import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { userimages } from "../schema/userimages";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Userimages = InferModel<typeof userimages>;
export type NewUserimages = InferModel<typeof userimages, 'insert'>; 

export const getUsSelfies = async function (phone: string) {
    return await db.select().from(userimages).where(eq(userimages.phone, phone))
};

export async function insertNewUserimages(NewUserimages: NewUserimages): Promise<MySqlRawQueryResult> {
    return db.insert(userimages).values(NewUserimages);
};