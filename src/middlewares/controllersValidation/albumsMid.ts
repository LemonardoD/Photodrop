import { NextFunction, Response } from "express";
import { AlCreationReq } from "../../DTO/controllersDTO";
import AlRepo from "../../db/repositories/albumRepo";
import { LengthValidation } from "../../utils/loginValid";
import moment from "moment";

export const alCreationVal = async (req: AlCreationReq, res: Response, next: NextFunction) => {
    const { albumName, albumLocation, date } = req.body;
    if (!albumName || !albumLocation || !date) {
        return res.status(406).json({
            status: 406,
            message: "4 album creation U must fill up all forms.",
        });
    }
    if (!LengthValidation(albumName) && !LengthValidation(albumLocation)) {
        return res.status(406).json({
            status: 406,
            message: "4 album creation U must fill up all forms. Length must be more than 5 symbols for each field.",
        });
    }
    if (!moment(date, "YYYY-MM-DD").isValid()) {
        return res.status(406).json({
            status: 406,
            message: "Date must be YYYY-MM-DD",
        });
    }
    const result = await AlRepo.getAlbumByName(albumName);
    if (result) {
        return res.status(200).json({
            status: 200,
            message: `We have album with name like that(${albumName}).`,
        });
    }
    next();
};
