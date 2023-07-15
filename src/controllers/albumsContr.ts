import { Response, Request } from "express";
import AlRepo from "../db/repositories/albumRepo";
import { AlCreationReq } from "../DTO/controllersDTO";

export const albumCreation = async (req: AlCreationReq, res: Response) => {
    const { albumName, albumLocation, date } = req.body;
    await AlRepo.insertAlbum({
        albumName,
        albumLocation,
        date,
        price: 5,
    });
    return res.status(201).json({
        status: 201,
        message: `Album ${albumName} successfully created!`,
    });
};

export const albumsList = async (req: Request, res: Response) => {
    const allAlbums = await AlRepo.getAlbums();
    return res.status(200).json({
        status: 200,
        message: allAlbums.map(function (el) {
            // if main photo row in table empty, res will be without main photo row
            if (el.mainPhoto === null) {
                return { id: el.albumId, albumName: el.albumName, albumLocation: el.albumLocation, albumDate: el.albumDate };
            }
            return {
                id: el.albumId,
                albumName: el.albumName,
                albumLocation: el.albumLocation,
                albumDate: el.albumDate,
                photo: el.mainPhoto,
            };
        }),
    });
};
