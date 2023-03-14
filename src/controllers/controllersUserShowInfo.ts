import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { acToken } from "../utils/tokens";
import { getUserByToken } from "../db/services/usersService";
import { getUsSelfies } from "../db/services/usrImagesService";

export const showAllSelfies: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const accessToken: string = req.headers.authorization.replace("Bearer ", "");
    const userInDB = await getUserByToken(accessToken);
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
        const selfies = await getUsSelfies(userInDB[0].phone);
        if (selfies.length) {
            return res.status(200).json({
                status: 200,
                message: selfies.map(function(el) {return {selfiePath: el.photopath}})
            });
        }
        return res.status(200).json({
            status: 200,
            message: "User don't uploaded selfies yet."
        });
    });
};

export const showNotif: RequestHandler = async (req, res) => {
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
        return res.status(200).json({
            status: 200,
            message: {
                phoneNotif: userInDB[0].phonenotif,
                emailNotif: userInDB[0].emailnotif,
                unsubscribeNotif: userInDB[0].unsubscribenotif
            }
        });
    });
};