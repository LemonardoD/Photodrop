import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { db } from "../db/db";
import { and, eq,  } from "drizzle-orm/expressions";
import { payedalbums } from "../db/schema/payedalbums";
import { cardLengthValidation, cvsLengthCheck, numberValidation } from "../utils/paymentValid";
import { acToken } from "../utils/tokens";
import { getUserByToken } from "../db/services/usersService";
import { getAlbumInfo } from "../db/services/albumServ";
import { confirmPaymentCheck, confirmPhotoPayment, getIfPayedAlbum, insertPayedalbum } from "../db/services/payedAlService";
import { getImageByAlbum, getImageById } from "../db/services/imageServices";
import dotenv from "dotenv";
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const albumPayment: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const tokenInDB = await getUserByToken(accessToken)
    if (!tokenInDB.length) {
        return res.status(404).json({
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(accessToken, acToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: "Token expired."
            });
        }
        const body = req.body;
        if(!body) {// Body info validating
            return res.status(406).json({
                status: 406,
                message: "Card info and album are required."
            });
        }
        const date = new Date();
        if (!numberValidation(body.card) || !cardLengthValidation(body.card)) {
            return res.status(406).json({
                status: 406,
                message: "Pleace, fill form right. Only numbers and required length 16 units."
            });
        }
        if (+body.exp_month > 12 || +body.exp_month < 0 || new Date(body.exp_year, body.exp_month) < date) {
            return res.status(406).json({
                status: 406,
                message: "Incorrect date."
            });
        }
        if (!numberValidation(body.cvc) || !cvsLengthCheck(body.cvc)) {
            return res.status(406).json({
                status: 406,
                message: "Incorrect CVC"
            });
        }
        if (!body.albumname) {
            return res.status(406).json({
                status: 406,
                message: "Albumn name required."
            });
        }
        const userInDB = await getUserByToken(accessToken)
        const albmInDB = await getAlbumInfo(body.albumname);
        const imgsInDB = await getImageByAlbum(body.albumname);
        const payedResultCheck = await confirmPaymentCheck(albmInDB[0].albumname, userInDB[0].phone); // Check if album already payed by client
        if (!albmInDB.length) {
            return res.status(404).json({
                status: 404,
                message: `We don't have album ${body.albumname} at our database.` 
            });
        }
        if (payedResultCheck.length) {
            return res.status(400).json({
                status: 400,
                message: `U already pay for all photos.`
            });
        }
        const strpToken = await stripe.tokens.create({  // Creating stripe token by card info
            card: {
                number: body.card,
                exp_month: body.exp_month,
                exp_year: body.exp_year,
                cvc: body.cvc,
            },
        });
        stripe.customers.create({  // Creating customer (stripe)
            email: userInDB[0].email,
            source: strpToken.id,
            name: userInDB[0].fullname,
            phone: userInDB[0].telebotnum,
        })
        .then((customer: {id: string}) =>{   // Creating payment using stripe token & client
            return  stripe.charges.create({
                amount: (Number(albmInDB[0].price)* imgsInDB.length) * 100,
                currency: "USD",
                customer: customer.id
            })
        })
        .then(async () =>{
            const payedInDB = await getIfPayedAlbum(body.albumname, userInDB[0].phone);
            if (payedInDB.length) {
                await db.delete(payedalbums).where(and(eq(payedalbums.payedphone, userInDB[0].phone), eq(payedalbums.payedalbum, body.albumname)));
                await insertPayedalbum({
                    payedalbum: body.albumname,
                    payedphone: userInDB[0].phone,
                    payedphoto: "all"
                });
                return res.status(200).json({ // Not redirect because of ngrok specification
                    status: 200,
                    message: "Successfully."
                });
            } else {  
                await insertPayedalbum({
                    payedalbum: body.albumname,
                    payedphone: userInDB[0].phone,
                    payedphoto: "all"
                });
                return res.status(200).json({ // Not redirect because of ngrok specification
                    status: 200,
                    message: "Successfully."
                });
            }
        })
        .catch((err: Error) => {
            return res.json({
                message: err.message
            });
        })   
    })
};

export const photoPayment: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const tokenInDB = await getUserByToken(accessToken)
    if (!tokenInDB.length) {
        return res.status(404).json({
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(accessToken, acToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: "Token expired."
            });
        }
        const body = req.body;  // 4 Body info validating
        if (!body) {  
            return res.status(406).json({
                status: 406,
                message: "Card info, album, photo id and price are required."
            });
        }
        const date = new Date();
        if (!numberValidation(body.card) || !cardLengthValidation(body.card)) {
            return res.status(406).json({
                status: 406,
                message: "Pleace fill thee form right. Only numbers and required length 16 units."
            });
        }
        if (+body.exp_month > 12 || +body.exp_month < 0 || new Date(body.exp_year, body.exp_month) < date) {
            return res.status(406).json({
                status: 406,
                message: "Incorrect date."
            });
        }
        if (!numberValidation(body.cvc) || !cvsLengthCheck(body.cvc)) {
            return res.status(406).json({
                status: 406,
                message: "Incorrect CVC"
            });
        }
        if (!body.photoid) {
            return res.status(406).json({
                status: 406,
                message: "Photo name required."
            });
        }
        const userInDB = await getUserByToken(accessToken);
        const imgInDB = await getImageById(body.photoid);
        const albmInDB = await getAlbumInfo(imgInDB[0].album);
        const payedAlbumResultCheck = await confirmPaymentCheck(imgInDB[0].album, userInDB[0].phone);   // Check if album already payed by client
        const payedPhotoResultCheck = await confirmPhotoPayment(imgInDB[0].album, userInDB[0].phone, body.photoid as string);     // Check if photo already payed by client
        if (!imgInDB.length) {
            return res.status(404).json({
                status: 404,
                message: `There is no photo with id ${body.photoid}.`
            });
        }
        if (payedAlbumResultCheck.length) {
            return res.status(400).json({
                status: 400,
                message: "U already pay for all photos."
            });
        }
        if (payedPhotoResultCheck.length) {
            return res.status(400).json({
                status: 400,
                message: "U already pay for that photos."
            });
        }
        const strpToken = await stripe.tokens.create({   // Creating stripe token by card info
            card: {
                number: body.card,
                exp_month: body.exp_month,
                exp_year: body.exp_year,
                cvc: body.cvc,
            },
        });
        stripe.customers.create({  // Creating customer (stripe)
            email: userInDB[0].email,
            source: strpToken.id,
            name: userInDB[0].fullname,
            phone: userInDB[0].telebotnum,
        })
        .then((customer: {id: string}) =>{  // Creating payment using stripe token & client
        return  stripe.charges.create({
            amount: Number(albmInDB[0].price) * 100,
            currency: "USD",
            customer: customer.id
            })
        })
        .then(async () =>{
            await insertPayedalbum({
                payedalbum: imgInDB[0].album,
                payedphone: userInDB[0].phone,
                payedphoto: body.photoid
            });
            return res.status(200).json({ // Not redirect because of ngrok specification
                status: 200,
                message: "Successfully."
            });  
        })
        .catch((err: Error) => {
            return res.json({
                message: err.message
            });
        })  
    }); 
};

export const photoPrice: RequestHandler = async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 5
    });
};