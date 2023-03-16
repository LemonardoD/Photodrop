import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import moment from "moment";
import { acToken } from "../utils/tokens";
import { LengthValidation } from "../utils/loginValid";
import { Album, getAlbumInfo, getAlbums, insertAlbum } from "../db/services/albumServ";
import { Photographers, getPhotograpersByToken } from "../db/services/photographerServ";

export const albumCreation: RequestHandler = async (req, res) => {
    if (!req.headers.authorization){
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const tokenInDB: Photographers[] = await getPhotograpersByToken(accessToken);
    if (!tokenInDB.length) {
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
        const albumInfo: Album = req.body;
        if (!albumInfo.albumname || !albumInfo.albumlocation || !albumInfo.date) {
            return res.status(406).json({ 
                status: 406,
                message: "4 album creation U must fill up all forms."
            });
        }
        if (!LengthValidation(albumInfo.albumname) && !LengthValidation(albumInfo.albumlocation)) {
            return res.status(406).json({ 
                status: 406,
                message: "4 album creation U must fill up all forms. Length must be more than 5 symbols for each field."
            });
        }
        if (!moment(albumInfo.date, "YYYY-MM-DD").isValid()) {
            return res.status(406).json({ 
                status: 406,
                message: "Date must be YYYY-MM-DD"
            });
        }
        const result: Album[] = await getAlbumInfo(albumInfo.albumname);
        if (result.length) {
            return res.status(200).json({ 
                status: 200,
                message: `We have album with name like that(${albumInfo.albumname}).`
                });
        }
        await insertAlbum({albumname: albumInfo.albumname,
            albumlocation: albumInfo.albumlocation,
            date: albumInfo.date,
            price: 5
        });
        return res.status(201).json({ 
            status: 201,
            message: `Album ${albumInfo.albumname} successfully creater!`
        });
    }) 
};

export const albumsList: RequestHandler = async (req, res) => {	
    if (!req.headers.authorization) {
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const tokenInDB: Photographers[]= await getPhotograpersByToken(accessToken);
    if (!tokenInDB.length) {
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
        const allAlbums = await getAlbums();
        return res.status(200).json({ 
            status: 200,
            message: allAlbums.map(function(el:Album) {  // if main photo row in table empty, res will be without main photo row
                if (el.mainphoto === null) {
                    return {id: el.id, albumname: el.albumname, albumlocation: el.albumlocation, albumdate: el.date}
                } else {
                    return {id: el.id, albumname: el.albumname, albumlocation: el.albumlocation, albumdate: el.date, photo: el.mainphoto} 
                }
            })
        });
    })
};
