import cookieParser from "cookie-parser";
import { Router } from "express";
import { acTokenVal, refTokenVal } from "../middlewares/protectedUrls";
import { errHandl } from "../middlewares/ErrHand";
import { alrExist, confirmPhoneLogin } from "../middlewares/controllerMiddlewares/signInUpMid";
import { paymentAlVal, paymentPhVal, paymentVal } from "../middlewares/controllerMiddlewares/paymentMid";
import { alPayment, phPayment, photoPrice } from "../controllers/paymentContr";
import { userOneAlbumVal } from "../middlewares/controllerMiddlewares/userAlbumsMid";
import { userAlbums, userOneAlbum } from "../controllers/albumContr";
import { chNotifVal, emailVal, nameVal, phoneVal } from "../middlewares/controllerMiddlewares/changeInfoValMid";
import { addChngEmail, addChngName, changePhone, setNotif } from "../controllers/userAddChangeInfoContr";
import { showAllSelfies, showNotif } from "../controllers/userShowInfoContr";
import { selfieUpload } from "../controllers/selfieContr";
import { loginConf, regUserPhone, resendLoginCode, rfrshTokens } from "../controllers/regLoginContr";

const router = Router();
router.use(cookieParser());

router.post("/us-phone-register", errHandl(alrExist), errHandl(regUserPhone));
router.post("/login-verify", errHandl(confirmPhoneLogin), errHandl(loginConf));
router.post("/refresh-login-verify", errHandl(acTokenVal), errHandl(resendLoginCode));
router.post("/tokens-refresh", errHandl(refTokenVal), errHandl(rfrshTokens));

router.post("/pay-4-album", errHandl(acTokenVal), errHandl(paymentVal), errHandl(paymentAlVal), errHandl(alPayment));
router.post("/pay-4-photo", errHandl(acTokenVal), errHandl(paymentVal), errHandl(paymentPhVal), errHandl(phPayment));

router.put("/us-change-name", errHandl(acTokenVal), errHandl(nameVal), errHandl(addChngName));
router.put("/us-change-email", errHandl(acTokenVal), errHandl(emailVal), errHandl(addChngEmail));
router.put("/us-change-phone", errHandl(acTokenVal), errHandl(phoneVal), errHandl(changePhone));
router.put("/us-change-notification-", errHandl(acTokenVal), errHandl(chNotifVal), errHandl(setNotif));
router.post("/add-selfie", errHandl(acTokenVal), errHandl(selfieUpload));

router.get("/us-show-notification", errHandl(acTokenVal), errHandl(showNotif));
router.get("/us-all-selfies", errHandl(acTokenVal), errHandl(showAllSelfies));
router.get("/us-albums", errHandl(acTokenVal), errHandl(userAlbums));
router.get("/us-albums/:album", errHandl(acTokenVal), errHandl(userOneAlbumVal), errHandl(userOneAlbum));
router.get("/photo-price", errHandl(photoPrice));

export default router;
