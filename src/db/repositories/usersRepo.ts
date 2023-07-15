import { UserInfoFromDB } from "../../controllers/types";
import { db } from "../db";
import { NewUserImages, userImages } from "../schema/userimages";
import { NewUser, users } from "../schema/users";
import { eq } from "drizzle-orm/expressions";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";

class UserRepo {
    async ifUserExist(phone: string): Promise<boolean> {
        const user = await db.select().from(users).where(eq(users.phone, phone));
        if (user) {
            return true;
        }
        return false;
    }

    async getUserInfoByPhone(phone: string): Promise<UserInfoFromDB> {
        const userInfo = await db
            .select({
                avatarLink: users.selfiePath,
                userName: users.fullname,
                phoneNumber: users.phone,
                userEmail: users.email,
                notificationSettings: {
                    textMessages: users.phoneNotif,
                    email: users.emailNotif,
                    unsubscribe: users.unsubscribeNotif,
                },
            })
            .from(users)
            .where(eq(users.phone, phone));
        return userInfo[0];
    }

    async ifUserExistByEmail(email: string) {
        const user = await db.select().from(users).where(eq(users.email, email));
        if (user) {
            return true;
        }
        return false;
    }

    async insertNewUser(newUser: NewUser): Promise<MySqlRawQueryResult> {
        return await db.insert(users).values(newUser);
    }

    async updateName(fullname: string, phone: string) {
        return await db.update(users).set({ fullname: fullname }).where(eq(users.phone, phone));
    }

    async updateEmail(email: string, phone: string) {
        return await db.update(users).set({ email: email }).where(eq(users.phone, phone));
    }

    async updatePhone(oldPhone: string, newPhone: string) {
        return await db.update(users).set({ phone: newPhone }).where(eq(users.phone, oldPhone));
    }
    async SetUnsubNotif(phone: string) {
        return await db.update(users).set({ phoneNotif: 0, emailNotif: 0, unsubscribeNotif: 1 }).where(eq(users.phone, phone));
    }

    async updateNotif(phoneNotif: number, emailNotif: number, phone: string) {
        return await db
            .update(users)
            .set({ phoneNotif: phoneNotif, emailNotif: emailNotif, unsubscribeNotif: 0 })
            .where(eq(users.phone, phone));
    }

    async getUserNotif(phone: string) {
        const user = await db
            .select({ phoneNotif: users.phoneNotif, emailNotif: users.emailNotif, unsubscribeNotif: users.unsubscribeNotif })
            .from(users)
            .where(eq(users.phone, phone));
        return user[0];
    }

    async getUsSelfies(phone: string) {
        return await db.select({ selfiePath: userImages.photoPath }).from(userImages).where(eq(userImages.phone, phone));
    }
}

export default new UserRepo();
