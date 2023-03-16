import { InferModel } from "drizzle-orm/mysql-core/table";
import { db } from "../db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm/expressions";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>; 

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

export async function insertNewUser(NewUser: NewUser): Promise<MySqlRawQueryResult> {
    return db.insert(users).values(NewUser);
};
