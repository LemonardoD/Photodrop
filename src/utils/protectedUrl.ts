import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { acToken, rfToken } from "../utils/tokens";
import { getPhotograperByReftoken, getPhotograpersByToken } from "../db/services/photographerServ";

export const accessPhotographersValidation: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const tokenInDB = await getPhotograpersByToken(req.headers.authorization.replace("Bearer ", ""));
    if (!tokenInDB.length) {
        return res.status(404).json({ 
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(req.headers.authorization.replace("Bearer ", ""), acToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({ 
                status: 403,
                message: "Token expired."
            });
        }
    })
    next()
}

export const refreshPhotographersValidation: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    const tokenInDB = await getPhotograperByReftoken(req.headers.authorization.replace("Bearer ", ""));
    if (!tokenInDB.length) {
        return res.status(404).json({ 
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(req.headers.authorization.replace("Bearer ", ""), rfToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({ 
                status: 403,
                message: "Token expired."
            });
        }
    })
    next()
}

export const accessAdminValidation: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    if (req.headers.authorization.replace("Bearer ", "") != "admin") {
        return res.status(403).json({ 
            status: 403,
            message: "You do not have access rights."
        });
    }
    next()
}