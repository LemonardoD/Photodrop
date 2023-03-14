import cookieParser from "cookie-parser";
import { Router } from "express";
import { confirmTelebotVerify, refeshTokens, regUserPhone, resendCode} from "../controllers/controllersRegLogin";
import { albumPayment, photoPayment, photoPrice } from "../controllers/controllersPayment";
import { addChangeEmail, addChangeName, changePhone, notificationSettings } from "../controllers/controllersUserAddChangeInfo";
import { userAlbums, userOneAlbum } from "../controllers/controllersAlbum";
import { showAllSelfies, showNotif } from "../controllers/controllersUserShowInfo";
import { selfieUpload } from "../controllers/controllersSelfie";

const router = Router();
router.use(cookieParser());

router.post("/us-phone-register", regUserPhone);
router.post("/confirmation-verify", confirmTelebotVerify);
router.post("/tokens-refresh", refeshTokens);
router.post("/refresh-verify", resendCode);
router.post("/pay-4-album", albumPayment);
router.post("/pay-4-photo", photoPayment);
router.put("/us-name-settings", addChangeName);
router.put("/us-email-settings", addChangeEmail);
router.put("/us-phone-settings", changePhone);
router.put("/us-notification-settings", notificationSettings);
router.get("/us-albums", userAlbums);
router.post("/addselfie/:phone", selfieUpload);
router.get("/us-albums/:album", userOneAlbum);
router.get("/us-selfies", showAllSelfies);
router.get("/photo-price", photoPrice);
router.get("/us-notification", showNotif);

export default router;