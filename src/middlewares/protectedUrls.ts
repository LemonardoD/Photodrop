import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { acToken, rfToken } from "../utils/tokens";

export const acTokenVal: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized.",
        });
    }
    jwt.verify(
        req.headers.authorization.replace("Bearer ", ""),
        acToken,
        function (err: jwt.VerifyErrors | null, token: string | jwt.JwtPayload | undefined) {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: "Token Expired",
                });
            }
            if (token != undefined && typeof token != "string") {
                res.locals.tokenData = token.data;
            }
            next();
        }
    );
};

export const refTokenVal: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized.",
        });
    }
    jwt.verify(
        req.headers.authorization.replace("Bearer ", ""),
        rfToken,
        function (err: jwt.VerifyErrors | null, token: string | jwt.JwtPayload | undefined) {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: "Token Expired",
                });
            }
            if (token != undefined && typeof token != "string") {
                res.locals.tokenData = token.data;
            }
            next();
        }
    );
};
