import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { photograpers } from "../schema/photographers";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Photographers = InferModel<typeof photograpers>;
export type NewPhotographer = InferModel<typeof photograpers, 'insert'>; 

export async function getPhotograper(login: string) {
    return await db.select().from(photograpers).where(eq(photograpers.login, login))
};

export async function getPhotograpers() {
    const allPhotographers = await db.select().from(photograpers)
    return allPhotographers.map(function(el:Photographers) {return {login: el.login , fullName: el.fullname, email: el.email, aproved: el.aproved}})
};

export async function getPhotograpersByToken(token: string) {
    return await db.select().from(photograpers).where(eq(photograpers.accesstoken, token))
};

export async function getPhotograperByReftoken(token: string) {
    return await db.select().from(photograpers).where(eq(photograpers.refreshtoken, token))
};

export async function insertPhotographerDB(photographer: NewPhotographer): Promise<MySqlRawQueryResult> {
    return db.insert(photograpers).values(photographer);
};

export async function aprovingPhotographer(photographer: string){
    return db.update(photograpers).set({ aproved: 1}).where(eq(photograpers.login, photographer));
};

export async function updateTokens(login: string, aToken: string, rToken: string){
    return db.update(photograpers).set({ accesstoken: aToken, refreshtoken: rToken}).where(eq(photograpers.login, login));
};


