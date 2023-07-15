import { Router } from "express";
import { refreshTokens, insertPhotographer, loginPhotographer } from "../controllers/signInUpContr";
import { refreshValidation } from "../middlewares/tokenAccess";
import { errHandl } from "../middlewares/errHandler";
import { ifAlreadyExist, loginValidationReq, signUpInInfoVal } from "../middlewares/controllersValidation/signInUpMid";

const signInUpRouter = Router();

signInUpRouter.post("/ph-register", errHandl(signUpInInfoVal), errHandl(ifAlreadyExist), errHandl(insertPhotographer));
signInUpRouter.post("/ph-login", errHandl(signUpInInfoVal), errHandl(loginValidationReq), errHandl(loginPhotographer));
signInUpRouter.post("/refresh-ph-tokens", errHandl(refreshValidation), errHandl(refreshTokens));

export default signInUpRouter;
