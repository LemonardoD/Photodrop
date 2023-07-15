import { Request } from "express";
import { tokenCreation } from "../utils/tokens";
import { bot, code, time } from "../utils/bot";
import { MyResponse, ReqResponse, SignInUpReq } from "./types";
import UsRepo from "../db/repositories/usersRepo";
import VerifyRepo from "../db/repositories/verifyPhoneRepo";
import dotenv from "dotenv";
dotenv.config();

export const regUserPhone = async (req: SignInUpReq, res: ReqResponse) => {
    const { newUser } = res.locals;
    const { phone } = req.body;
    if (newUser) {
        await UsRepo.insertNewUser({
            phone: phone,
        });
        await VerifyRepo.insertPhoneVerify({
            phone: phone,
        });
        return res.status(201).json({
            status: 201,
            message: "Registration successful.",
        });
    }
    return res.status(200).json({
        status: 200,
        message: "Login.",
    });
};

export const rfrshTokens = async (req: Request, res: MyResponse) => {
    const { phone } = res.locals;
    const tokens = await tokenCreation(phone); // Creating  tokens
    res.cookie("phone", phone, { httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME) });
    res.cookie("jwtTokens", tokens, { httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME) }); // Assigning tokens in http-only cookie
    return res.json(tokens);
};

export const loginConf = async (req: SignInUpReq, res: MyResponse) => {
    const { phone } = req.body;
    const usInfo = await UsRepo.getUserInfoByPhone(phone);
    const tokens = await tokenCreation(phone); // Creating  tokens
    res.cookie("phone", phone, { httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME) });
    res.cookie("jwtTokens", tokens, { httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME) }); // Assigning tokens in http-only cookie
    return res.status(200).json({
        status: 200,
        usInfo,
        tokens,
    });
};

export const resendLoginCode = async (req: SignInUpReq, res: MyResponse) => {
    const { phone } = req.body;
    const verifUsInDB = await VerifyRepo.getVerifyInfo(phone);
    const chatId = Number(verifUsInDB.telegramId);
    switch (verifUsInDB.tryCount) {
        case 0:
            bot.sendMessage(chatId, "Go login in the app.");
            break;
        case 1:
            await VerifyRepo.updatePhoneVerify(code, time, req.body.phone, verifUsInDB.tryCount + 1); // Updating DB with new code and timestamp
            bot.sendMessage(chatId, `Success. You have only 3 minutes. To process this code:  ${code}`);
            break;
        default:
            bot.sendMessage(chatId, "You've only one chance 4 resend.");
    }
    return res.status(200).json({
        status: 200,
        message: "Code at our telegram.",
    });
};
