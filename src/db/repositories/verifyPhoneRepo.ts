import { db } from "../db";
import { eq } from "drizzle-orm/expressions";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { NewPhoneVerify, phVerify } from "../schema/verify";

class PhVerifyRepo {
    async getVerifyInfo(phone: string) {
        const verifFromDB = await db.select().from(phVerify).where(eq(phVerify.phone, phone));
        return verifFromDB[0];
    }

    async getVerifyByCode(phone: string, code: string) {
        const codeDB = await db
            .select({ codeDB: phVerify.verifyCode, time: phVerify.timestamp, id: phVerify.telegramId })
            .from(phVerify)
            .where(eq(phVerify.phone, phone));
        const currentTime = new Date().getTime() / 1000;
        if (codeDB[0].codeDB != code) {
            throw new Error("Wrong confirmation code.");
        }
        if (codeDB[0].time === null) {
            throw new Error("U don't trigger 'SendCode'.");
        }
        if (currentTime - codeDB[0].time >= 180) {
            throw new Error("Code has been expired. If it was your first try, click resend the code!");
        }
        return codeDB[0].id as string;
    }

    async insertPhoneVerify(newVerify: NewPhoneVerify): Promise<MySqlRawQueryResult> {
        return await db.insert(phVerify).values(newVerify);
    }

    async updatePhoneNumber(oldPhone: string, newPhone: string) {
        return await db.update(phVerify).set({ phone: newPhone }).where(eq(phVerify.phone, oldPhone));
    }

    async updatePhoneVerify(code: string, time: number, phone: string, tries: number) {
        return await db
            .update(phVerify)
            .set({ verifyCode: code, timestamp: time, tryCount: tries })
            .where(eq(phVerify.phone, phone));
    }

    async setZeroVerify(id: string) {
        return await db.update(phVerify).set({ tryCount: 0 }).where(eq(phVerify.telegramId, id));
    }
}

export default new PhVerifyRepo();
