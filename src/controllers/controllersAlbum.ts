import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { acToken } from "../utils/tokens";
import { getAlbumInfo } from "../db/services/albumServ";
import { getUserByToken } from "../db/services/usersService";
import { getIfPayed, getIfPayedAlbum } from "../db/services/payedAlService";
import { getImagesWOdate, getImagesWdate } from "../db/services/imageServices";

export const userAlbums: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const userInDB = await getUserByToken(accessToken)
    if (!userInDB.length) {
        return res.status(404).json({
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(accessToken, acToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: "Token expired."
            });
        }
        let payedCheck: (string | number)[] = [];  // array 4 payed albums
        const phone: string = userInDB[0].phone
        const payedInfo = await getIfPayed(userInDB[0].phone);
        for (let i=0; i < payedInfo.length; i++) {  // add payed albums & photos into array
            if (payedInfo[i].payedphoto === "all") {
                payedCheck.push(payedInfo[i].payedalbum.toLowerCase())
            }
            payedCheck.push(Number(payedInfo[i].payedphoto))
            
        }
        const albumResultInfo = await getImagesWOdate(phone);
        if (!payedInfo.length) {
            return res.status(200).json({
                status: 200,
                message: albumResultInfo.map(function(el) {return {album: el.album, path: el.pathW, id: el.id, marked: true}})
            });
        }
        let finalRes = albumResultInfo.map(function(el) {  // Sorting paths watermarked or not
            if (payedCheck.includes(el.album as string)) {
                return {
                    album : el.album,
                    path: el.path,
                    id: el.id
                }
            } else if (payedCheck.includes(el.id)) {
                return {
                    album : el.album,
                    path: el.path,
                    id: el.id
                }
            } else {
                return {
                    album : el.album,
                    path: el.pathW,
                    id: el.id,
                    marked: true
                }
            }
        });
        return res.status(200).json({
            status: 200,
            message: finalRes
        });
    });
};


export const userOneAlbum: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const userInDB = await getUserByToken(accessToken)
    if (!userInDB.length) {
        return res.status(404).json({
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(accessToken, acToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: "Token expired."
            });
        }
        const phone: string = userInDB[0].phone;
        const albumName: string = req.params.album;
        const AlbumInDB = await getAlbumInfo(albumName)
        if (!AlbumInDB.length) {
            return res.status(404).json({
                status: 404,
                message: `We don't have album, ${albumName}, at our database.`
            });
        }
        let payedCheck: (string | number)[] = [];  // array 4 payed albums
        const payedInfo = await getIfPayedAlbum(albumName, phone);
        for (let i=0; i < payedInfo.length; i++){  // Add payed photos into array
            if (payedInfo[i].payedphoto === "all") {
                payedCheck.push("all")
            }
            payedCheck.push(Number(payedInfo[i].payedphoto))
        }
        const albumResultInfo = await getImagesWdate(albumName, phone);
        if (!payedInfo.length) {
            return res.status(200).json({
                status: 200,
                message: albumResultInfo.map(function(el) {return {album: el.album, aldate: el.date, path: el.pathW, id: el.id, marked: true}})
            });
        }
        let finalRes = albumResultInfo.map(function(el) {
            if (payedCheck.includes("all")) {  // if all in control array give wo watermark
                return {
                    album : el.album,
                    aldate: el.date,
                    path: el.path,
                    id: el.id
                }
            } else if (payedCheck.includes(Number(el.id))) {  // if id of photo in control array give wo watermark
                return {
                    album : el.album,
                    aldate: el.date,
                    path: el.path,
                    id: el.id
                }
            } else {
                return {
                    album : el.album,
                    aldate: el.date,
                    path: el.pathW,
                    id: el.id,
                    marked: true
                }
            }
        });
        return res.status(200).json({
            status: 200,
            message: finalRes
        });
    });
    
};