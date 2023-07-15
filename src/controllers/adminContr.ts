import { Response, Request } from "express";
import { LoginReq, ResponseAlAdminDto, SetPriceReq } from "../DTO/middlewaresDTO";
import PhRepo from "../db/repositories/phRepo";
import AlRepo from "../db/repositories/albumRepo";

export const activatePhotographer = async (req: LoginReq, res: Response) => {
    return res.status(200).json({
        status: 200,
        message: `Photographer ${req.body.login} successfully activated!`,
    });
};

export const AllPhotographers = async (req: Request, res: Response) => {
    const allPhotographers = await PhRepo.getPhotographers();
    return res.status(200).json({
        status: 200,
        message: allPhotographers,
    });
};

export const getSpecificAlbum = async (req: Request, res: ResponseAlAdminDto) => {
    const { album } = res.locals;
    return res.status(200).json({
        status: 200,
        message: album,
    });
};

export const addAlbumPrice = async (req: SetPriceReq, res: Response) => {
    const { albumName } = req.params;
    const { price } = req.body;
    await AlRepo.updateAlbumPrice(albumName, price);
    return res.status(200).json({
        status: 200,
        message: "Price updated.",
    });
};
