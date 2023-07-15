import { db } from "../db";
import { and, eq } from "drizzle-orm/expressions";
import { MySqlRawQueryResult } from "drizzle-orm/mysql2";
import { NewPayedAlbum, payedAlbums } from "../schema/payedalbums";

class PaymentRepo {
    async getAlbumsPayment(phone: string) {
        const payedInfo = await db.select().from(payedAlbums).where(eq(payedAlbums.payedPhone, phone));
        return payedInfo.map(function (el) {
            if (el.payedPhoto === "all") {
                return el.payedAlbum.toLowerCase();
            }
            return el.payedPhoto;
        });
    }

    async getAlbumPaymentInfoByAlName(albumName: string, phone: string) {
        const payedInfo = await db
            .select()
            .from(payedAlbums)
            .where(and(eq(payedAlbums.payedAlbum, albumName), eq(payedAlbums.payedPhone, phone)));

        return payedInfo.map(function (el) {
            return el.payedPhoto;
        });
    }

    async ifPayedAllByAlName(albumName: string, phone: string): Promise<boolean> {
        const payedInfo = await db
            .select()
            .from(payedAlbums)
            .where(and(eq(payedAlbums.payedAlbum, albumName), eq(payedAlbums.payedPhone, phone)));
        return payedInfo[0].payedPhoto === "all";
    }

    async ifPayedAll(albumName: string, phone: string) {
        const payment = await db
            .select()
            .from(payedAlbums)
            .where(
                and(eq(payedAlbums.payedAlbum, albumName), eq(payedAlbums.payedPhone, phone), eq(payedAlbums.payedPhoto, "all"))
            );
        if (!payment) {
            return false;
        }
        return true;
    }

    async ifPayedPhoto(albumName: string, phone: string, photoid: string) {
        const payment = await db
            .select()
            .from(payedAlbums)
            .where(
                and(eq(payedAlbums.payedAlbum, albumName), eq(payedAlbums.payedPhone, phone), eq(payedAlbums.payedPhoto, photoid))
            );
        if (!payment) {
            return false;
        }
        return true;
    }

    async insertPayedAlbum(payedAlbum: NewPayedAlbum): Promise<MySqlRawQueryResult> {
        return await db.insert(payedAlbums).values(payedAlbum);
    }

    async delPhotoByAl(phone: string, albumName: string) {
        return await db.delete(payedAlbums).where(and(eq(payedAlbums.payedPhone, phone), eq(payedAlbums.payedAlbum, albumName)));
    }
}

export default new PaymentRepo();
