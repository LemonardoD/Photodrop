import { db } from "../db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm/expressions";

export const getUserByToken = async function (token: string) {
    return await db.select().from(users).where(eq(users.accesstoken, token));
};

export const getUserByPhone = async function (phone: string) {
    return await db.select().from(users).where(eq(users.phone, phone));
};

export const getUserByRefToken = async function (refToken: string) {
    return await db.select().from(users).where(eq(users.refreshtoken, refToken));
};

export const getUserByEmail = async function (email: string) {
    return await db.select().from(users).where(eq(users.email, email));
};