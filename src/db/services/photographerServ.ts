import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { photograpers } from "../schema/photographers";
import { InferModel } from "drizzle-orm/mysql-core/table";

export const getPhotograper = async function (login: string) {
    return await db.select().from(photograpers).where(eq(photograpers.login, login))
};

export const getPhotograpers = async function () {
    return await db.select().from(photograpers)
};

export const getPhotograpersByToken = async function (token: string) {
    return await db.select().from(photograpers).where(eq(photograpers.accesstoken, token))
};

export const getPhotograperByReftoken = async function (token: string) {
    return await db.select().from(photograpers).where(eq(photograpers.refreshtoken, token))
};

export type Photographers = InferModel<typeof photograpers>;
