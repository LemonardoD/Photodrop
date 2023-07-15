import { SignInUpReq } from "../../controllers/types";
import { NextFunction, Response } from "express";
import { phoneValidation } from "../../utils/infoValidators";
import UsRepo from "../../db/repositories/usersRepo";
import { bot, code, time } from "../../utils/bot";
import VerifyRepo from "../../db/repositories/verifyPhoneRepo";

export const alrExist = async (req: SignInUpReq, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(406).json({
            status: 406,
            message: "Phone are required!",
        });
    }
    if (!phoneValidation(phone)) {
        return res.status(406).json({
            status: 406,
            message: "Phone can contain only numbers. Also length must be at least 10 symbols.",
        });
    }
    if (await UsRepo.ifUserExist(phone)) {
        const verResult = await VerifyRepo.getVerifyInfo(phone);
        if (verResult.telegramId === null) {
            return res.status(200).json({
                status: 200,
                message: "User already exists, but he doesn't sen mess to telegram bot",
            });
        }
        const chatId = Number(verResult.telegramId);
        switch (verResult.tryCount) {
            case 0:
                // Control check if it's first attempt
                bot.sendMessage(chatId, `Success. You have only 3 minutes. To process this code:  ${code}`);
                await VerifyRepo.updatePhoneVerify(code, time, phone, 1);
                break;
            case 1:
                // If attempt not first guiding to get second code
                bot.sendMessage(chatId, "You must click resend code.");
                break;
        }
        res.locals.newUser = false;
        next();
    }
    res.locals.newUser = true;
    next();
};

export const confirmPhoneLogin = async (req: SignInUpReq, res: Response, next: NextFunction) => {
    const { phone, code } = req.body;
    if (!code || !phone) {
        return res.status(406).json({
            status: 406,
            message: "Provide code and phone for verification.",
        });
    }
    const userInDB = await UsRepo.ifUserExist(phone);
    if (userInDB === false) {
        return res.status(404).json({
            status: 404,
            message: "User not found.",
        });
    }
    const teleId = await VerifyRepo.getVerifyByCode(phone, code);
    await VerifyRepo.setZeroVerify(teleId);
    next();
};

export const newLoginCode = async (req: SignInUpReq, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(406).json({
            status: 406,
            message: "We need ur phone number.",
        });
    }
    const usInDB = await UsRepo.ifUserExist(phone);
    const verifUsInDB = await VerifyRepo.getVerifyInfo(phone);
    if (!usInDB) {
        return res.status(404).json({
            status: 404,
            message: "That number don't signup yet.",
        });
    }
    if (verifUsInDB.telegramId === null) {
        return res.status(404).json({
            status: 404,
            message: "User with that number don't get first code yet.",
        });
    }
    if (verifUsInDB.tryCount === null) {
        return res.status(404).json({
            status: 404,
            message: "User with that number don't get first code yet.",
        });
    }
    next();
};
