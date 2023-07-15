import { Request } from "express";
import { MyResponse } from "./types";
import UsRepo from "../db/repositories/usersRepo";

export const showAllSelfies = async (req: Request, res: MyResponse) => {
    const { phone } = res.locals;
    const selfies = await UsRepo.getUsSelfies(phone);
    return res.status(200).json({
        status: 200,
        selfies,
    });
};

export const showNotif = async (req: Request, res: MyResponse) => {
    const { phone } = res.locals;
    const usNotification = await UsRepo.getUserNotif(phone);
    return res.status(200).json({
        status: 200,
        usNotification,
    });
};
