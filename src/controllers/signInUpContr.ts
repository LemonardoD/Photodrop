import { Response, Request } from "express";
import bcrypt from "bcrypt";
import { accessTokenCreation, refreshTokenCreation } from "../utils/tokens";
import { regPhRequest } from "../DTO/controllersDTO";
import PhRepo from "../db/repositories/phRepo";
import { LoginReq, ResponseDto } from "../DTO/middlewaresDTO";

export const insertPhotographer = async (req: regPhRequest, res: Response) => {
    const { login, password, fullname, email } = req.body;
    if (fullname && email) {
        await PhRepo.insertPhotographer({
            login,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            fullname,
            email,
        });
        return res.status(201).json({
            status: 201,
            message: `Photographer ${login} successfully registration! W8 till we activate ur profile.`,
        });
    }
    await PhRepo.insertPhotographer({
        login,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    return res.status(201).json({
        status: 201,
        message: `Photographer ${login} successfully registration! W8 till we activate ur profile.`,
    });
};

export const loginPhotographer = async (req: LoginReq, res: Response) => {
    const { login } = req.body;
    const accessToken = await accessTokenCreation(login);
    const refreshToken = await refreshTokenCreation(login);
    return res.status(200).json({
        status: 200,
        message: `Welcome ${login}`,
        token: accessToken,
        refreshToken: refreshToken,
    });
};

export const refreshTokens = async (req: Request, res: ResponseDto) => {
    const { login } = res.locals;
    const accessToken = await accessTokenCreation(login);
    const refreshToken = await refreshTokenCreation(login);
    return res.status(200).json({ accessToken, refreshToken });
};
