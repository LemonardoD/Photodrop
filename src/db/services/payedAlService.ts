import { db } from "../db";
import { and, eq } from "drizzle-orm/expressions";
import { payedalbums } from "../schema/payedalbums";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Payedalbum = InferModel<typeof payedalbums>;
export type NewPayedalbum = InferModel<typeof payedalbums, 'insert'>; 

export const getIfPayed = async function (phone: string) {
    return await db.select().from(payedalbums).where(eq(payedalbums.payedphone, phone))
};

export const getIfPayedAlbum = async function (albumName: string, phone: string) {
    return await db.select().from(payedalbums)
    .where(and(eq(payedalbums.payedalbum, albumName), eq(payedalbums.payedphone, phone)))
};
export const confirmPaymentCheck = async function (albumName: string, phone: string) {
    return await db.select().from(payedalbums).where(and(eq(payedalbums.payedalbum, albumName), 
    eq(payedalbums.payedphone, phone), eq(payedalbums.payedphoto, "all")))
};

export const confirmPhotoPayment = async function (albumName: string, phone: string, photoid: string) {
    return await db.select().from(payedalbums).where(and(eq(payedalbums.payedalbum, albumName), 
    eq(payedalbums.payedphone, phone), eq(payedalbums.payedphoto, photoid)))
};

export async function insertPayedalbum(Newpayedalbums: NewPayedalbum): Promise<MySqlRawQueryResult> {
    return db.insert(payedalbums).values(Newpayedalbums);
};
