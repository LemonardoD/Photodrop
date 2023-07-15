import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { acToken, rfToken } from "../utils/tokens";

export const accessValidation: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized.",
        });
    }
    jwt.verify(req.headers.authorization.replace("Bearer ", ""), acToken, async (err: VerifyErrors | null) => {
        async (err: jwt.VerifyErrors | null, token: string | jwt.JwtPayload | undefined) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: "Token expired.",
                });
            }
            if (token != undefined && typeof token != "string") {
                res.locals.login = token.data;
            }
            next();
        };
    });
    next();
};

export const refreshValidation: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized.",
        });
    }
    jwt.verify(
        req.headers.authorization.replace("Bearer ", ""),
        rfToken,
        async (err: jwt.VerifyErrors | null, token: string | jwt.JwtPayload | undefined) => {
            if (err) {
                return res.status(403).json({
                    status: 403,
                    message: "Token expired.",
                });
            }
            if (token != undefined && typeof token != "string") {
                res.locals.login = token.data;
            }
            next();
        }
    );
    next();
};

export const accessAdmin: RequestHandler = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized.",
        });
    }
    if (req.headers.authorization.replace("Bearer ", "") != "admin") {
        return res.status(403).json({
            status: 403,
            message: "You do not have access rights.",
        });
    }
    next();
};
