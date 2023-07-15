import { Router } from "express";
import { errHandl } from "../middlewares/errHandler";
import { accessValidation } from "../middlewares/tokenAccess";
import { MulterVal, addUserOnPhVal, onImgSMS } from "../middlewares/controllersValidation/imgMid";
import { addUsersOnPhoto, photoUpload } from "../controllers/workWithImgContr";
import { alCreationVal } from "../middlewares/controllersValidation/albumsMid";
import { albumCreation } from "../controllers/albumsContr";

const imgRouter = Router();

imgRouter.post("/create-an-album", errHandl(accessValidation), errHandl(alCreationVal), errHandl(albumCreation));
imgRouter.post(
    "/upload-photos-to-s3",
    errHandl(accessValidation),
    errHandl(MulterVal),
    errHandl(onImgSMS),
    errHandl(photoUpload)
);
imgRouter.post("/photos/:id", errHandl(accessValidation), errHandl(addUserOnPhVal), errHandl(addUsersOnPhoto));

export default imgRouter;
