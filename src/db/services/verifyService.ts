import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { tableFVerify } from "../schema/verify";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type TableFVerify = InferModel<typeof tableFVerify>;
export type NewTableFVerify= InferModel<typeof tableFVerify, 'insert'>; 

export function getVerify (phone: string) {
    return db.select().from(tableFVerify).where(eq(tableFVerify.phone, phone));
};

export function getVerifyByCode (code: string) {
    return db.select().from(tableFVerify).where(eq(tableFVerify.verifycode, code));
};

export function insertTableFVerify(NewtableFVerify: NewTableFVerify): Promise<MySqlRawQueryResult> {
    return db.insert(tableFVerify).values(NewtableFVerify);
};

export function updateTableFVerify(telegramid: string, code: string, time: number, phone: string, trycount: number) {
    return db.update(tableFVerify).set({ telegramid: telegramid, verifycode: code, timestamp: time, trycount: trycount})
    .where(eq(tableFVerify.phone, phone));
};

export function setZeroVerify(telegramid: string){
    return db.update(tableFVerify).set({trycount: 0}).where(eq(tableFVerify.telegramid, telegramid))
};