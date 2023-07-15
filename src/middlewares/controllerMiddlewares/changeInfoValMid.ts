import { NextFunction, Response } from "express";
import { ChangeAddReq } from "../../controllers/types";
import { emailValidation, nameLengthCheck, nameValidation, phoneValidation } from "../../utils/infoValidators";
import UsRepo from "../../db/repositories/usersRepo";

export const nameVal = async (req: ChangeAddReq, res: Response, next: NextFunction) => {
    const { fullname } = req.body;
    if (!fullname) {
        return res.status(406).json({
            status: 406,
            message: "We need to know your full name. Simply for photos where you were tagged.",
        });
    }
    if (!nameLengthCheck(fullname) || !nameValidation(fullname)) {
        // Length & symbols validation
        return res.status(406).json({
            status: 406,
            message: "Full name allow only letters, also length more than 3 letters.",
        });
    }
    next();
};

export const emailVal = async (req: ChangeAddReq, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
        return res.status(406).json({
            status: 406,
            message: "Please provide an email adress.",
        });
    }
    if (!emailValidation(email)) {
        // Email form validation
        return res.status(406).json({
            status: 406,
            message: "Email adress should look like this: somethimg@bla.com",
        });
    }
    const alreadyExist = await UsRepo.ifUserExistByEmail(email);
    if (!alreadyExist) {
        // Email existing validating
        return res.status(409).json({
            status: 409,
            message: "Email like that alredy exist.",
        });
    }
    next();
};

export const phoneVal = async (req: ChangeAddReq, res: Response, next: NextFunction) => {
    const { newPhone } = req.body;
    const { phone } = res.locals;
    if (!newPhone) {
        return res.status(406).json({
            status: 406,
            message: "Please provide an Phone number.",
        });
    }
    if (!phoneValidation(phone)) {
        // Length & symbols validation
        return res.status(406).json({
            status: 406,
            message: "Phone can contain only numbers. Also length must be at least 10 symbols.",
        });
    }
    if (phone === newPhone) {
        // Length & symbols validation
        return res.status(406).json({
            status: 406,
            message: "U already use this phone number.",
        });
    }
    next();
};

export const chNotifVal = async (req: ChangeAddReq, res: Response, next: NextFunction) => {
    const { phoneNotif, emailNotif } = req.body;
    if (!phoneNotif || !emailNotif) {
        // Coz value of zero is !phoneNotif or !emailNotif
        return res.status(406).json({
            status: 406,
            message: "Please set up notification settings.",
        });
    }
    next();
};
