import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { db } from "../db/db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm/expressions";
import { emailValidation, nameLengthCheck, nameValidation, phoneValidation } from "../utils/usInfoValidators";
import { acToken } from "../utils/tokens";
import { getUserByEmail, getUserByPhone, getUserByToken } from "../db/services/usersService";

export const addChangeName: RequestHandler = async (req, res) => {
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
        const fullname: string = req.body.fullname;
        if (!fullname) {
            return res.status(406).json({
                status: 406,
                message: "We need to know your full name. Simply for photos where you were tagged."
            });
        }
        if (!nameLengthCheck(fullname) || !nameValidation(fullname)) {  // Length & symbols validation
            return res.status(406).json({
                status: 406,
                message: "Full name allow only letters, also length more than 3 letters."
            });
        }
        await db.update(users).set({fullname: fullname}).where(eq(users.accesstoken, accessToken));
        return res.status(200).json({
            status: 200,
            message: `Hello there ${fullname}!`
        });
    });
};

export const addChangeEmail: RequestHandler = async (req, res) => {
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
        const email: string = req.body.email;
        const alreadyExist = await getUserByEmail(email);
        if (!email) {
            return res.status(406).json({
                status: 406,
                message: "Please provide an email adress."
            });
        }
        if (!emailValidation(email)) {  // Email form validation
            return res.status(406).json({
                status: 406,
                message: "Email adress should look like this: somethimg@bla.com"
            });
        } 
        if (alreadyExist.length) {  // Email existing validating
            return res.status(409).json({
                status: 409,
                message: "Email like that alredy exist."
            });
        }
        await db.update(users).set({email: email}).where(eq(users.accesstoken, accessToken));
        return res.status(200).json({
            status: 200,
            message: "Email added!"
        });
    });
};

export const changePhone: RequestHandler = async (req, res) => {
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
        const phone: string = req.body.phone;
        if (!phone) {
            return res.status(406).json({
                status: 406,
                message: "Please provide an Phone number."
            });
        }
        if (!phoneValidation(phone)) {   // Length & symbols validation
            return res.status(406).json({
                status: 406,
                message: "Phone can contain only numbers. Also length must be at least 10 symbols."
            });
        }
        const userInDB = await getUserByPhone(phone);  // Check if we already have phone like that
        if (!userInDB.length) {
            await db.update(users).set({phone: phone, accesstoken: null, refreshtoken: null, phoneisveryfied: 0}).where(eq(users.accesstoken, accessToken));
            return res.status(200).json({
                status: 200,
                message: "Phone changed, please confirm your new number by TelegramBot confirmation."
            });
        }
        return res.status(409).json({
            status: 409,
            message: "Phone already exist in our db."
        });
    });
};

export const notificationSettings: RequestHandler = async (req, res) => {
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
        const phoneNotif: string = req.body.phonenotif;
        const emailNotif: string =  req.body.emailnotif;
        const unsubscribenotif: number =  Number(req.body.unsubscribenotif);
        if (phoneNotif === undefined || emailNotif === undefined || phoneNotif=== "" || emailNotif=== ""){  // Coz value of zero is !phoneNotif or !emailNotif
            return res.status(406).json({
                status: 406,
                message: "Please set up notification settings."
            });
        }
        if (unsubscribenotif === 1) {  // if unsubscribe is  1, setting phone & email notification at 0
            await db.update(users).set({phonenotif: 0, emailnotif: 0, unsubscribenotif: 1}).where(eq(users.accesstoken, accessToken));
            return res.status(200).json({
                status: 200,
                message: "Notification settings successfully changed."
            });
        }
        if (Number(phoneNotif) === 0 && Number(emailNotif) === 0) {  // if phone & email notification is 0, setting unsubscribe at 1 
            await db.update(users).set({phonenotif: 0, emailnotif: 0, unsubscribenotif: 1}).where(eq(users.accesstoken, accessToken));
            return res.status(200).json({
                status: 200,
                message: "Notification settings successfully changed."
            });
        }
        await db.update(users).set({phonenotif: Number(phoneNotif), emailnotif: Number(emailNotif), unsubscribenotif: 0}).where(eq(users.accesstoken, accessToken));
        return res.status(200).json({
            status: 200,
            message: "Notification settings successfully changed."
        });// if at least one of phone or email 1, set unsubscribe 0 and phone & email as in body 
    });
};
