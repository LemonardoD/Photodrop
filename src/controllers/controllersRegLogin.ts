import { RequestHandler } from "express";
import { User } from "../db/schema/users";
import { phoneValidation } from "../utils/usInfoValidators";
import { accessTokenCreation, refreshTokenCreation } from "../utils/tokens";
import { bot } from "../utils/bot";
import { addTokens, getUserByPhone, insertNewUser, updateTokens } from "../db/services/usersService";
import { getVerify, getVerifyByCode, insertTableFVerify, setZeroVerify, updateTableFVerify } from "../db/services/verifyService";
import dotenv from "dotenv";
dotenv.config();

export const  regUserPhone: RequestHandler = async (req, res) => {	
    const info: User = req.body;
    if (!info.phone){
        return res.status(406).json({
            status: 406,
            message: "Phone are required!"
        });
    }
    if (!phoneValidation(info.phone)) {
        return res.status(406).json({
            status: 406,
            message: "Phone can contain only numbers. Also length must be at least 10 symbols."
        });
    }
    const nameApparence = await getUserByPhone(info.phone)
    if (nameApparence.length) {
        const verufyingResult = await getVerify(info.phone);
        const code: string = Math.floor(100000 + Math.random() * 900000).toString();  // Generating random six numbers
        const time: number = new Date().getTime() / 1000 // Creating & adding timestamp
        if (verufyingResult[0].telegramid === null) {
            return res.status(200).json({
                status: 200,
                message: "User already exists, but he doesn't sen mess to telegram bot"
            });
        } 
        const chatId: number = Number(verufyingResult[0].telegramid)
        if (verufyingResult[0].trycount === 0) {  // Control check if it's first attempt
            bot.sendMessage(chatId, code);
            bot.sendMessage(chatId, "Success. You have only 3 minutes.");
            await updateTableFVerify(chatId.toString(), code, time, info.phone, 1);  // else if  telegram chat verify someone, updating DB row with control numbers.
        } else if (verufyingResult[0].trycount as number >= 1) {  // If attempt not first guiding to get second code
            bot.sendMessage(chatId, "You must click resend code.");
        }
        return res.status(200).json({
            status: 200,
            message: "Logining."
        });
    } else {
        await insertNewUser({
            phone: info.phone
        });
        await insertTableFVerify({
            phone: info.phone
        });
        return res.status(201).json({
            status: 201,
            message: "Registrated."
        });
    }  
};

export const refeshTokens: RequestHandler = async (req, res) => {
    const phone = req.body.phone;
    const accessToken = await accessTokenCreation(phone);// Creating  tokens
    const refreshToken = await refreshTokenCreation(phone);
    res.cookie("phone", phone, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    res.cookie("jwtAccess", accessToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});   // Assigning tokens in http-only cookie
    res.cookie("jwtRefresh", refreshToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    await updateTokens(phone, accessToken, refreshToken);  // Adding tokens to DB
    return res.json({accessToken, refreshToken });   
};

export const confirmTelebotVerify: RequestHandler = async (req, res) => {
    const code: string = req.body.code;
    const phone: string = req.body.phone;
    if (!code || !phone) {
        return res.status(406).json({
            status: 406,
            message: "Provide code and phone for verification."
        });
    }
    const verifyInDB = await getVerifyByCode(code);
    const userInDB = await getUserByPhone(phone);
    const currentTime: number = new Date().getTime() / 1000
    if (!verifyInDB.length){
        return res.status(406).json({
            status: 406,
            message: "Wrong code."
        });
    }
    if (verifyInDB[0].timestamp === null){
        return res.status(404).json({
            status: 404,
            message: "Timestamp not found."
        });
    }
    if (verifyInDB.length && currentTime - verifyInDB[0].timestamp >= 180){  // Check code length and if it was sent less than 3 min ago
        return res.status(406).json({
            status: 406,
            message: "Code has been expired. If it was your firts try, resend the code!"
        });
    }
    if (!userInDB.length) {
        return res.status(404).json({
            status: 404,
            message: "User not found.",
        });  
    }
    await setZeroVerify(verifyInDB[0].telegramid as string);
    const accessToken = await accessTokenCreation(phone);// Creating  tokens
    const refreshToken = await refreshTokenCreation(phone);
    res.cookie("phone", phone, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    res.cookie("jwtAccess", accessToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});  // Assigning tokens in http-only cookie
    res.cookie("jwtRefresh", refreshToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    await addTokens(phone, verifyInDB[0].telegramid, accessToken, refreshToken);  // Adding tokens to DB
    return res.status(200).json({
        status: 200,
        message: "Confirmed",
        accessToken: accessToken,
        refreshToken: refreshToken,
        avatarLink: userInDB[0].selfiepath,
        userName: userInDB[0].fullname,
        phoneNumber: userInDB[0].phone,
        userEmail: userInDB[0].email,
        notificationSettings: {
            textMessages: userInDB[0].phonenotif,
            email: userInDB[0].emailnotif,
            unsubscribe: userInDB[0].unsubscribenotif
        }
    });
};

export const resendCode: RequestHandler = async (req, res) => {
    if (!req.body.phone) {
        return res.status(406).json({
            status: 406,
            message: "We need ur hpone number."
        });
    }
    const userInDB = await getUserByPhone(req.body.phone);
    const verufyingResult = await getVerify(req.body.phone);
    if (!userInDB.length) {
        return res.status(404).json({
            status: 404,
            message: "That number don't registrated yet."
        });
    }
    if (!verufyingResult.length) {
        return res.status(404).json({
            status: 404,
            message: "User with that number don't get first code yet."
        });
    }
    if (verufyingResult[0].telegramid === null) {
        return res.status(404).json({
            status: 404,
            message: "User with that number don't get first code yet."
        });
    } 
    if (verufyingResult[0].trycount === null){
        return res.status(404).json({
            status: 404,
            message: "User with that number don't get first code yet."
        });
    } 
    const code: string = Math.floor(100000 + Math.random() * 900000).toString();  // Generating new random six numbers
    const chatId: number = Number(verufyingResult[0].telegramid)                   
    if (verufyingResult[0].trycount >= 2) {  // If attempts more that 2, send info that u cann't use more
        bot.sendMessage(chatId, "You've only one chance 4 resend.");
    } else if (verufyingResult[0].trycount === 0) {  // Wasn't single try redirect to getcode
        bot.sendMessage(chatId, "At first type /getCode");
    } else if (verufyingResult[0].trycount === 1) {
        const time: number = new Date().getTime() / 1000
        await updateTableFVerify(chatId.toString(), code, time, req.body.phone, verufyingResult[0].trycount+1);  // Updating DB with new code and timestamp
        bot.sendMessage(chatId, code);
        bot.sendMessage(chatId, "Success. You have only 3 minutes.");
    }
    return res.status(200).json({
        status: 200,
        message: "Your code at ur telegram."
    })   
};