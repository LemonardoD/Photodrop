import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { tableFVerify } from "../schema/verify";

export const getVerify = async function (phone: string) {
    return await db.select().from(tableFVerify).where(eq(tableFVerify.phone, phone));
};

export const getVerifyByCode = async function (code: string) {
    return await db.select().from(tableFVerify).where(eq(tableFVerify.verifycode, code));
};
