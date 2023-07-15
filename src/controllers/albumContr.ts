import { Request } from "express";
import { AlbumReq, MyResponse } from "./types";
import PaymentRepo from "../db/repositories/paymentRepo";
import ImgRepo from "../db/repositories/imageRepo";
import { phArrMapping } from "../utils/photoResp";

export const userAlbums = async (req: Request, res: MyResponse) => {
    const { phone } = res.locals;
    const payments = await PaymentRepo.getAlbumsPayment(phone);
    const imgs = await ImgRepo.getImagesByPhone(phone);
    if (!payments.length) {
        return res.status(200).json({
            status: 200,
            message: imgs.map(function (el) {
                return { album: el.album, path: el.pathWtr, resizedPath: el.resizedPathWtr, phId: el.PhId };
            }),
        });
    }
    return res.status(200).json({
        status: 200,
        message: phArrMapping(imgs, payments),
    });
};

export const userOneAlbum = async (req: AlbumReq, res: MyResponse) => {
    const { phone } = res.locals;
    const { album } = req.params;
    const payedAll = await PaymentRepo.ifPayedAllByAlName(album, phone);
    if (payedAll) {
        return res.status(200).json({
            status: 200,
            message: await ImgRepo.getAllImgWOWtr(album, phone),
        });
    }
    if (!payedAll) {
        return res.status(200).json({
            status: 200,
            message: await ImgRepo.getAllImgWWtr(album, phone),
        });
    }
    const payedPhId = await PaymentRepo.getAlbumPaymentInfoByAlName(album, phone);
    const imgs = await ImgRepo.getImagesByAlNameAndClient(album, phone);
    return res.status(200).json({
        status: 200,
        message: phArrMapping(imgs, payedPhId),
    });
};
