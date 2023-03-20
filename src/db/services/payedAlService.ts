import { db } from "../db";
import { and, eq } from "drizzle-orm/expressions";
import { payedalbums } from "../schema/payedalbums";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type Payedalbum = InferModel<typeof payedalbums>;
export type NewPayedalbum = InferModel<typeof payedalbums, 'insert'>; 

export async function getIfPayed (phone: string) {
    return await db.select().from(payedalbums).where(eq(payedalbums.payedphone, phone))
};

export async function getIfPayedAlbum (albumName: string, phone: string) {
    return await db.select().from(payedalbums)
    .where(and(eq(payedalbums.payedalbum, albumName), eq(payedalbums.payedphone, phone)))
};
export async function confirmPaymentCheck (albumName: string, phone: string) {
    return await db.select().from(payedalbums).where(and(eq(payedalbums.payedalbum, albumName), 
    eq(payedalbums.payedphone, phone), eq(payedalbums.payedphoto, "all")))
};

export async function confirmPhotoPayment (albumName: string, phone: string, photoid: string) {
    return await db.select().from(payedalbums).where(and(eq(payedalbums.payedalbum, albumName), 
    eq(payedalbums.payedphone, phone), eq(payedalbums.payedphoto, photoid)))
};

export async function insertPayedalbum(Newpayedalbums: NewPayedalbum): Promise<MySqlRawQueryResult> {
    return db.insert(payedalbums).values(Newpayedalbums);
};
export async function delOnePhoto(phone: string, albumname: string, ): Promise<MySqlRawQueryResult> {
    return db.delete(payedalbums).where(and(eq(payedalbums.payedphone, phone), eq(payedalbums.payedalbum, albumname)));
};