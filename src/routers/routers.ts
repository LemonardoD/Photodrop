import cookieParser from "cookie-parser";
import { Router } from "express";
import { confirmTelebotVerify, refeshTokens, regUserPhone, resendCode} from "../controllers/controllersRegLogin";
import { albumPayment, photoPayment, photoPrice } from "../controllers/controllersPayment";
import { addChangeEmail, addChangeName, changePhone, notificationSettings } from "../controllers/controllersUserAddChangeInfo";
import { userAlbums, userOneAlbum } from "../controllers/controllersAlbum";
import { showAllSelfies, showNotif } from "../controllers/controllersUserShowInfo";
import { accessPhotographersValidation, refreshPhotographersValidation } from "../utils/protectedUrl";
import { selfieUpload } from "../controllers/emergUpload";
import { handleCallback } from "../utils/tryCatch";

const router = Router();
router.use(cookieParser());

router.post("/us-phone-register", handleCallback(regUserPhone));
router.post("/confirmation-verify", handleCallback(confirmTelebotVerify));
router.post("/tokens-refresh", refreshPhotographersValidation, handleCallback(refeshTokens));
router.post("/refresh-verify", accessPhotographersValidation, handleCallback(resendCode));
router.post("/pay-4-album", accessPhotographersValidation, handleCallback(albumPayment));
router.post("/pay-4-photo", accessPhotographersValidation, handleCallback(photoPayment));
router.post("/us-notification", accessPhotographersValidation, handleCallback(showNotif));
router.post("/us-selfies", accessPhotographersValidation, handleCallback(showAllSelfies));
router.put("/us-name-settings", accessPhotographersValidation, handleCallback(addChangeName));
router.put("/us-email-settings", accessPhotographersValidation, handleCallback(addChangeEmail));
router.put("/us-phone-settings", accessPhotographersValidation, handleCallback(changePhone));
router.put("/us-notification-settings", accessPhotographersValidation, handleCallback(notificationSettings));
router.get("/us-albums", accessPhotographersValidation, handleCallback(userAlbums));
router.post("/addselfie/:phone", accessPhotographersValidation, handleCallback(selfieUpload));
router.get("/us-albums/:album", accessPhotographersValidation, handleCallback(userOneAlbum));
router.get("/photo-price", accessPhotographersValidation, handleCallback(photoPrice));

export default router;