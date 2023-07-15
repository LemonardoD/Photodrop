import { NextFunction, Response } from "express";
import { LoginReq, SetPriceReq, paramsAlbumNameReq } from "../../DTO/middlewaresDTO";
import PhRepo from "../../db/repositories/phRepo";
import AlRepo from "../../db/repositories/albumRepo";

export const ifUserExist = async (req: LoginReq, res: Response, next: NextFunction) => {
    const { login } = req.body;
    if (!login) {
        return res.status(406).json({
            status: 406,
            message: "U must fill up login to activate the user.",
        });
    }
    const result = await PhRepo.getPhotographerByLogin(login);
    if (!result) {
        return res.status(404).json({
            status: 404,
            message: `Sorry there is no Photographer with such login ${login}.`,
        });
    }
    res.locals.photographer = result;
    next();
};

export const ifAlbumExist = async (req: paramsAlbumNameReq, res: Response, next: NextFunction) => {
    const { albumName } = req.params;
    const resultAl = await AlRepo.getSpecificAlbum(albumName);
    if (!resultAl) {
        return res.status(404).json({
            status: 404,
            message: `We don't have album ${albumName} at our database.`,
        });
    }
    res.locals.album = resultAl;
    next();
};

export const priceVal = async (req: SetPriceReq, res: Response, next: NextFunction) => {
    const { price } = req.body;
    if (!price) {
        return res.status(406).json({
            status: 406,
            message: "Don't be ridiculous, everything has a price.",
        });
    }
    if (price < 0) {
        return res.status(406).json({
            status: 406,
            message: "Price must be greater than zero.",
        });
    }
    next();
};
