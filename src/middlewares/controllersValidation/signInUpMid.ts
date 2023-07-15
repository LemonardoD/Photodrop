import { Response, NextFunction } from "express";
import { LoginReq } from "../../DTO/middlewaresDTO";
import { LengthValidation, loginValidation } from "../../utils/loginValid";
import PhRepo from "../../db/repositories/phRepo";
import bcrypt from "bcrypt";

export const signUpInInfoVal = async (req: LoginReq, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(406).json({
            status: 406,
            message: "Login and password are required!(U must fill them up)",
        });
    }
    if (!loginValidation(login) || !LengthValidation(login) || !LengthValidation(password)) {
        return res.status(406).json({
            status: 406,
            message:
                "Login can contain only letters and the underscore character. Correct ur login and try again! Length of login & password must be more than 5.",
        });
    }
    next();
};

export const ifAlreadyExist = async (req: LoginReq, res: Response, next: NextFunction) => {
    const { login } = req.body;
    const result = await PhRepo.getPhotographerByLogin(login);
    if (result) {
        return res.status(200).json({
            status: 200,
            message: `We already have this login: ${login}.`,
        });
    }
    next();
};

export const loginValidationReq = async (req: LoginReq, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    const result = await PhRepo.getPhotographerByLogin(login);
    if (!result) {
        return res.status(406).json({
            status: 406,
            message: "Invalid credentials.",
        });
    }
    if (!bcrypt.compareSync(password, result.password)) {
        return res.status(406).json({
            status: 406,
            message: "Incorrect password, try again.",
        });
    }
    if (result.approved === 0) {
        return res.status(404).json({
            status: 404,
            message: "Sorry but you haven't been approved yet.",
        });
    }

    next();
};
