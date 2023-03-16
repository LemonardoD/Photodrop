import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { db } from "../db/db";
import { photograpers } from "../db/schema/photographers";
import { eq } from 'drizzle-orm/expressions';
import { acToken, rfToken } from "../utils/tokens";
import { LengthValidation, loginValidation } from "../utils/loginValid";
import { Photographers, getPhotograper, getPhotograperByReftoken, insertPhotographerDB } from "../db/services/photographerServ";

export const  insertPhotographer: RequestHandler = async (req, res) => {	
    const info: Photographers = req.body;
    if (!info.login || !info.password){
        return res.status(406).json({
            status: 406,
            message: "Login and password are required!(U must fill them up)"
        });
    }
    if (!loginValidation(info.login) || !LengthValidation(info.login) || !LengthValidation(info.password)) {
        return res.status(406).json({ 
            status: 406,
            message: "Login can contain only letters and the underscore character. Correct ur login and try again! Length of login & password must be more than 5."
        });
    }
    const result: Photographers[] = await getPhotograper(info.login);
    if (result.length) {
        return res.status(200).json({ 
            status: 200,
            message: `We already have this login: ${info.login}.`
        });
    }
    await insertPhotographerDB({
        login: info.login,
        password: bcrypt.hashSync(info.password, bcrypt.genSaltSync(10)),
        fullname: info.fullname,
        email: info.email
    });
    return res.status(201).json({ 
        status: 201,
        message: `Photographer ${info.login} successfully registrated! W8 till we activate ur profile.`
    });
};

export const  loginPhotographer: RequestHandler = async (req, res) => {	
    const logInInfo: Photographers = req.body;
    if (!logInInfo.login || !logInInfo.password){
        return res.status(406).json({ 
            status: 406,
            message: "U must fill up the form!"
        });
    } else {
        const result: Photographers[] = await getPhotograper(logInInfo.login);
        if(result.length){
            if(bcrypt.compareSync(logInInfo.password, result[0].password) && result[0].aproved === 1){
                // Creating  access token
                const accessToken:string = jwt.sign({data: logInInfo.login}, acToken, {expiresIn: "30m"});
                // Creating refresh token
                const refreshToken = jwt.sign({data: logInInfo.login}, rfToken, {expiresIn: "1d"});
                // assigning refresh token in http-only cookie 
                res.cookie("login", logInInfo.login, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
                res.cookie("jwtAccess", accessToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
                res.cookie("jwtRefresh", refreshToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
                // adding tokens to DB
                await db.update(photograpers).set({ accesstoken: accessToken, refreshtoken: refreshToken}).where(eq(photograpers.login, logInInfo.login));
                return res.status(200).json({ 
                    status: 200,
                    message: `Welcome ${logInInfo.login}`,
                    token: accessToken,
                    refreshtoken: refreshToken
                });
            }else if(bcrypt.compareSync(logInInfo.password, result[0].password) && result[0].aproved === 0){
                return res.status(404).json({ 
                    status: 404,
                    message: "Sorry but you haven't been aproved yet."
                });
            }else{
                return res.status(406).json({ 
                    status: 406,
                    message: "Incorrect password, try again."
                });
            }    
        }else{
            return res.status(406).json({ 
                status: 406,
                message: "Invalid credentials."
            });
        }
    }
};

export const refeshTokens: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ 
            status: 401,
            message: "Unauthorized."
        });
    }
    const reqToken: string = req.headers.authorization.replace("Bearer ", "");
    const tokenInDB = await getPhotograperByReftoken(reqToken);
    if (!tokenInDB.length) {
        return res.status(404).json({ 
            status: 404,
            message: "Wrong token."
        });
    }
    jwt.verify(reqToken, rfToken, async (err:  VerifyErrors | null) => {
        if (err) {
            return res.status(403).json({
                status: 403,
                message: "Token expired."
            });
        }
        // if correct refreshtoken we create & send a new pair of tokens
        const accessToken: string = jwt.sign({data: tokenInDB[0].login},acToken, {expiresIn: "30m"});
        const refreshToken: string = jwt.sign({data: tokenInDB[0].login}, rfToken, {expiresIn: "1d"});
        // reassigning tokens to DB and cookies
        res.cookie("login", tokenInDB[0].login, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
        res.cookie("jwtAccess", accessToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
        res.cookie("jwtRefresh", refreshToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
        await db.update(photograpers).set({ accesstoken: accessToken}).where(eq(photograpers.login, tokenInDB[0].login));
        await db.update(photograpers).set({ refreshtoken: refreshToken}).where(eq(photograpers.login, tokenInDB[0].login));
        return res.json({ accessToken,  refreshToken});   
    })
};