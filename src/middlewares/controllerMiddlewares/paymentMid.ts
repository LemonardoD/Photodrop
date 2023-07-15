import { NextFunction } from "express";
import { MyResponse, Payment4AlReq, Payment4PhReq } from "../../controllers/types";
import { cardLengthValidation, cvsLengthCheck, numberValidation } from "../../utils/infoValidators";
import { getAlbumInfoByName } from "../../db/repositories/albumRepo";
import ImgRepo from "../../db/repositories/imageRepo";
import PayRepo from "../../db/repositories/paymentRepo";

export const paymentVal = async (req: Payment4AlReq, res: MyResponse, next: NextFunction) => {
    const { card, year, month, cvc } = req.body;
    if (!card || !year || !month || !cvc) {
        return res.status(406).json({
            status: 406,
            message: "Card info and album are required.",
        });
    }
    const date = new Date();
    if (!numberValidation(card) || !cardLengthValidation(card)) {
        return res.status(406).json({
            status: 406,
            message: "Please, fill form right. Only numbers and required length 16 units.",
        });
    }
    if (month > 12 || month < 0 || new Date(year, month) < date) {
        return res.status(406).json({
            status: 406,
            message: "Incorrect date.",
        });
    }
    if (!numberValidation(cvc) || !cvsLengthCheck(cvc)) {
        return res.status(406).json({
            status: 406,
            message: "Incorrect CVC",
        });
    }

    next();
};

export const paymentAlVal = async (req: Payment4AlReq, res: MyResponse, next: NextFunction) => {
    const { phone } = res.locals;
    const { album } = req.body;
    if (!album) {
        return res.status(406).json({
            status: 406,
            message: "Album name are required.",
        });
    }
    const alInDB = await getAlbumInfoByName(album);
    if (!alInDB) {
        return res.status(404).json({
            status: 404,
            message: `We don't have album ${album} at our database.`,
        });
    }
    const payedResultCheck = await PayRepo.ifPayedAll(album, phone); // Check if album already payed by client
    if (payedResultCheck) {
        return res.status(400).json({
            status: 400,
            message: "U already pay for all photos.",
        });
    }
    next();
};

export const paymentPhVal = async (req: Payment4PhReq, res: MyResponse, next: NextFunction) => {
    const { phone } = res.locals;
    const { phId } = req.body; // 4 Body info validating
    if (!phId) {
        return res.status(406).json({
            status: 406,
            message: "Photo id required.",
        });
    }
    const imgInDB = await ImgRepo.getImageById(phId);
    if (!imgInDB.length) {
        return res.status(404).json({
            status: 404,
            message: `There is no photo with id ${phId}.`,
        });
    }
    const payedAllAlResult = await PayRepo.ifPayedAll(imgInDB[0].album, phone); // Check if album already payed by client
    if (payedAllAlResult) {
        return res.status(400).json({
            status: 400,
            message: "U already pay for all photos.",
        });
    }
    const payedPhotoResult = await PayRepo.ifPayedPhoto(imgInDB[0].album, phone, phId.toString()); // Check if photo already payed by client
    if (payedPhotoResult) {
        return res.status(400).json({
            status: 400,
            message: "U already pay for that photo.",
        });
    }
    next();
};
