import { AlbumReq } from "../../controllers/types";
import { NextFunction, Response } from "express";
import { getAlbumInfoByName } from "../../db/repositories/albumRepo";

export const userOneAlbumVal = async (req: AlbumReq, res: Response, next: NextFunction) => {
    const { album } = req.params;
    if (await getAlbumInfoByName(album)) {
        return res.status(404).json({
            status: 404,
            message: `We don't have album, ${album}, at our database.`,
        });
    }
    next();
};
