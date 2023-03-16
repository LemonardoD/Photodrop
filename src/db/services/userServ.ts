import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { users } from "../schema/users";

export const getUser = async function (phone: string) {
    return await db.select().from(users).where(eq(users.phone, phone));
};
