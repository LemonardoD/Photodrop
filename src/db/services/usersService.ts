import { InferModel } from "drizzle-orm/mysql-core/table";
import { db } from "../db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm/expressions";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>; 

export async function getUserByToken(token: string) {
    return await db.select().from(users).where(eq(users.accesstoken, token));
};

export async function getUserByPhone(phone: string) {
    return await db.select().from(users).where(eq(users.phone, phone));
};

export async function getUserByRefToken(refToken: string) {
    return await db.select().from(users).where(eq(users.refreshtoken, refToken));
};

export async function getUserByEmail(email: string) {
    return await db.select().from(users).where(eq(users.email, email));
};

export async function insertNewUser(NewUser: NewUser): Promise<MySqlRawQueryResult> {
    return db.insert(users).values(NewUser);
};

export async function addTokens(phone: string, telegramid: string | null, aToken: string, rToken: string){
    return db.update(users).set({accesstoken: aToken, refreshtoken: rToken, phoneisveryfied:1,
        telebotnum: Number(telegramid)}).where(eq(users.phone, phone))
};

export async function updateTokens(phone: string, aToken: string, rToken: string){
    return db.update(users).set({accesstoken: aToken, refreshtoken: rToken, phoneisveryfied:1}).where(eq(users.phone, phone))
};

export async function updateName(fullname: string, aToken: string){
    return db.update(users).set({fullname: fullname}).where(eq(users.accesstoken, aToken));
};

export async function updateEmail(email: string, aToken: string){
    return await db.update(users).set({email: email}).where(eq(users.accesstoken, aToken));
};

export async function updatePhone(phone: string, aToken: string){
    return db.update(users).set({phone: phone, accesstoken: null, refreshtoken: null, phoneisveryfied: 0}).where(eq(users.accesstoken, aToken));
};

export async function MakeUnsubNotiff(aToken: string){
    return db.update(users).set({phonenotif: 0, emailnotif: 0, unsubscribenotif: 1}).where(eq(users.accesstoken, aToken));
};

export async function updateNotiff(phonenotif: number, emailnotif: number, aToken: string){
    return db.update(users).set({phonenotif: phonenotif, emailnotif: emailnotif, unsubscribenotif: 0}).where(eq(users.accesstoken, aToken));
};

export async function updateSelfiePath(phone: string, selfiepath: string){
    return db.update(users).set({ selfiepath: selfiepath}).where(eq(users.phone, phone));
};