import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { accessTokenCreation, refreshTokenCreation } from "../utils/tokens";
import { LengthValidation, loginValidation } from "../utils/loginValid";
import { Photographers, getPhotograper, insertPhotographerDB, updateTokens } from "../db/services/photographerServ";

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
    const result = await getPhotograper(info.login);
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
    if (!req.body.login || !req.body.password) {
        return res.status(406).json({ 
            status: 406,
            message: "U must fill up the form!"
        });
    }
    const logInInfo: Photographers = req.body;
    const result = await getPhotograper(logInInfo.login);
    if (!result.length) {
        return res.status(406).json({ 
            status: 406,
            message: "Invalid credentials."
        });
    }
    if (!bcrypt.compareSync(logInInfo.password, result[0].password)) {
        return res.status(406).json({ 
            status: 406,
            message: "Incorrect password, try again."
        });
    }
    if (result[0].aproved === 0) {
        return res.status(404).json({ 
            status: 404,
            message: "Sorry but you haven't been aproved yet."
        });
    }
    const accessToken = await accessTokenCreation(logInInfo.login)
    const refreshToken = await refreshTokenCreation(logInInfo.login)
    // assigning refresh token in http-only cookie
    res.cookie("login", logInInfo.login, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    res.cookie("jwtAccess", accessToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    res.cookie("jwtRefresh", refreshToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    // adding tokens to DB
    await updateTokens(logInInfo.login,  accessToken, refreshToken);
    return res.status(200).json({ 
        status: 200,
        message: `Welcome ${logInInfo.login}`,
        token: accessToken,
        refreshtoken: refreshToken
    });
};

export const refeshTokens: RequestHandler = async (req, res, ) => {
    const login = req.body.login;
    const tokenInDB = await getPhotograper(login);
    // if correct refreshtoken we create & send a new pair of tokens
    const accessToken = await accessTokenCreation(tokenInDB[0].login)
    const refreshToken = await refreshTokenCreation(tokenInDB[0].login)
    // reassigning tokens to DB and cookies
    res.cookie("login", login, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    res.cookie("jwtAccess", accessToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    res.cookie("jwtRefresh", refreshToken, {httpOnly: true, maxAge: Number(process.env.TOKEN_LIFETIME)});
    await updateTokens(tokenInDB[0].login, accessToken, refreshToken);
    return res.json({ accessToken,  refreshToken});
};