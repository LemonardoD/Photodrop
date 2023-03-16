import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { tableFVerify } from "../schema/verify";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

export type TableFVerify = InferModel<typeof tableFVerify>;
export type NewTableFVerify= InferModel<typeof tableFVerify, 'insert'>; 

export const getVerify = async function (phone: string) {
    return await db.select().from(tableFVerify).where(eq(tableFVerify.phone, phone));
};

export const getVerifyByCode = async function (code: string) {
    return await db.select().from(tableFVerify).where(eq(tableFVerify.verifycode, code));
};

export async function insertTableFVerify(NewtableFVerify: NewTableFVerify): Promise<MySqlRawQueryResult> {
    return db.insert(tableFVerify).values(NewtableFVerify);
};
