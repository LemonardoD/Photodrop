import { InferModel } from "drizzle-orm/mysql-core/table";
import { db } from "../db";
import { users } from "../schema/users";
import { eq } from "drizzle-orm/expressions";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>; 

export function getUserByToken(token: string) {
    return db.select().from(users).where(eq(users.accesstoken, token));
};

export function getUserByPhone(phone: string) {
    return db.select().from(users).where(eq(users.phone, phone));
};

export function getUserByRefToken(refToken: string) {
    return db.select().from(users).where(eq(users.refreshtoken, refToken));
};

export function getUserByEmail(email: string) {
    return db.select().from(users).where(eq(users.email, email));
};

export function insertNewUser(NewUser: NewUser): Promise<MySqlRawQueryResult> {
    return db.insert(users).values(NewUser);
};

export function addTokens(phone: string, telegramid: string | null, aToken: string, rToken: string){
    return db.update(users).set({accesstoken: aToken, refreshtoken: rToken, phoneisveryfied:1,
        telebotnum: Number(telegramid)}).where(eq(users.phone, phone))
};

export function updateTokens(phone: string, aToken: string, rToken: string){
    return db.update(users).set({accesstoken: aToken, refreshtoken: rToken, phoneisveryfied:1}).where(eq(users.phone, phone))
};

export function updateName(fullname: string, phone: string){
    return db.update(users).set({fullname: fullname}).where(eq(users.phone, phone));
};

export function updateEmail(email: string, phone: string){
    return db.update(users).set({email: email}).where(eq(users.phone, phone));
};

export function updatePhone(phone: string, aToken: string){
    return db.update(users).set({phone: phone, accesstoken: null, refreshtoken: null, phoneisveryfied: 0}).where(eq(users.accesstoken, aToken));
};

export function MakeUnsubNotiff(phone: string){
    return db.update(users).set({phonenotif: 0, emailnotif: 0, unsubscribenotif: 1}).where(eq(users.phone, phone));
};

export function updateNotiff(phonenotif: number, emailnotif: number, phone: string){
    return db.update(users).set({phonenotif: phonenotif, emailnotif: emailnotif, unsubscribenotif: 0}).where(eq(users.phone, phone));
};

export function updateSelfiePath(phone: string, selfiepath: string){
    return db.update(users).set({ selfiepath: selfiepath}).where(eq(users.phone, phone));
};