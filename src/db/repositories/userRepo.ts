import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { users } from "../schema/users";
import { InferModel } from "drizzle-orm/mysql-core/table";

export type Users = InferModel<typeof users>;

export const getUserByName = async function (name: string) {
    return await db.select().from(users).where(eq(users.fullname, name));
};
