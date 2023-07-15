import { RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();
import { MyResponse, Payment4AlReq, Payment4PhReq } from "./types";
import { stripe, strpToken } from "../utils/stripe";
import UsRepo from "../db/repositories/usersRepo";
import ImgRepo from "../db/repositories/imageRepo";
import PayRepo from "../db/repositories/paymentRepo";

export const alPayment = async (req: Payment4AlReq, res: MyResponse) => {
    const { phone } = res.locals;
    const { album, card, year, month, cvc } = req.body;
    const token = await strpToken(card, year, month, cvc);
    const user = await UsRepo.getUserInfoByPhone(phone);
    stripe.customers
        .create({
            // Creating customer (stripe)
            email: user.userEmail,
            source: token.id,
            name: user.userEmail,
            phone: user.phoneNumber,
        })
        .then(async (customer: { id: string }) => {
            // Creating payment using stripe token & client
            return stripe.charges.create({
                amount: Number(process.env.PHOTO_PRICE) * (await ImgRepo.getImgNumberByAlbum(album)) * 100,
                currency: "USD",
                customer: customer.id,
            });
        })
        .then(async () => {
            if (await PayRepo.ifPayedAllByAlName(album, phone)) {
                await PayRepo.delPhotoByAl(phone, album);
            }
            await PayRepo.insertPayedAlbum({
                payedAlbum: album,
                payedPhone: phone,
                payedPhoto: "all",
            });
            return res.status(200).json({
                status: 200,
                message: "Successfully.",
            });
        })
        .catch((err: Error) => {
            return res.json({
                message: err.message,
            });
        });
};

export const phPayment = async (req: Payment4PhReq, res: MyResponse) => {
    const { phone } = res.locals;
    const { phId, card, year, month, cvc } = req.body;
    const token = await strpToken(card, year, month, cvc);
    const user = await UsRepo.getUserInfoByPhone(phone);
    const imgInDB = await ImgRepo.getImageById(phId);
    stripe.customers
        .create({
            // Creating customer (stripe)
            email: user.userEmail,
            source: token.id,
            name: user.userName,
            phone: user.phoneNumber,
        })
        .then((customer: { id: string }) => {
            // Creating payment using stripe token & client
            return stripe.charges.create({
                amount: Number(process.env.PHOTO_PRICE) * 100,
                currency: "USD",
                customer: customer.id,
            });
        })
        .then(async () => {
            await PayRepo.insertPayedAlbum({
                payedAlbum: imgInDB[0].album,
                payedPhone: phone,
                payedPhoto: phId.toString(),
            });
            return res.status(200).json({
                // Not redirect because of ngrok specification
                status: 200,
                message: "Successfully.",
            });
        })
        .catch((err: Error) => {
            return res.json({
                message: err.message,
            });
        });
};

export const photoPrice: RequestHandler = async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: Number(process.env.PHOTO_PRICE),
    });
};
