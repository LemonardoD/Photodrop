import { NextFunction, Response } from "express";
import { ResponseUsersOnImg, addUsersOnPhotoReq } from "../../DTO/middlewaresDTO";
import { LengthValidation } from "../../utils/loginValid";
import { MulterReq } from "../../DTO/controllersDTO";
import AlRepo from "../../db/repositories/albumRepo";
import ImgRepo from "../../db/repositories/imageRepo";
import { botMessSender } from "../../utils/bot";

export const addUserOnPhVal = async (req: addUsersOnPhotoReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { users } = req.body;
    const imgResult = await ImgRepo.getImageById(id);
    if (!imgResult.length) {
        return res.status(404).json({
            status: 404,
            message: `We don't have photo ${id} at our database.`,
        });
    }
    if (!users) {
        return res.status(406).json({
            status: 406,
            message: "Fill form, to mark users on the photo.",
        });
    }
    if (!LengthValidation(users)) {
        return res.status(406).json({
            status: 406,
            message: "Length of full name must be more than 5.",
        });
    }
    next();
};

export const MulterVal = async (req: MulterReq, res: Response, next: NextFunction) => {
    const { album } = req.body;
    if (!req.files) {
        return res.status(406).json({
            status: 406,
            message: "You must attach photos!",
        });
    }
    if (!album) {
        return res.status(406).json({
            status: 406,
            message: "Album name are required!",
        });
    }
    const albumInDB = await AlRepo.getAlbumByName(album); // Album name validation
    if (!albumInDB) {
        return res.status(404).json({
            status: 404,
            message: `There is no album with such name ${album}.`,
        });
    }
    next();
};

export const onImgSMS = async (req: MulterReq, res: ResponseUsersOnImg, next: NextFunction) => {
    const usersOnPhoto = req.body.users;
    if (usersOnPhoto) {
        const arrUsersOnPhoto = usersOnPhoto.split("*");
        await botMessSender(usersOnPhoto);
        res.locals.users = arrUsersOnPhoto;
        next();
    }
    next();
};
