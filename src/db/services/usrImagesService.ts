import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { userimages } from "../schema/userimages";

export const getUsSelfies = async function (phone: string) {
    return await db.select().from(userimages).where(eq(userimages.phone, phone))
};
