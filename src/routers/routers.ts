import { Router } from "express";   
import {refeshTokens, insertPhotographer, loginPhotographer } from "../controllers/controllerRegLog";
import cookieParser from "cookie-parser";
import { albumCreation, albumsList } from "../controllers/controllerAlbums";
import { PhotographersList, activatePhotographer, addAlbumPrice, addUsersOnPhoto, getAlbum } from "../controllers/controllerAdmin";
import { photoUpload } from "../controllers/controllerImgupload";
import { accessPhotographersValidation, accessAdminValidation, refreshPhotographersValidation } from "../utils/protectedUrl";
import { handleCallback } from "../utils/tryCatch";

const router = Router();
router.use(cookieParser());

router.post('/ph-register', handleCallback(insertPhotographer));
router.put('/ph-activate', accessAdminValidation, handleCallback(activatePhotographer));
router.post('/ph-login', handleCallback(loginPhotographer));
router.post('/refresh-ph-tokens', refreshPhotographersValidation, handleCallback(refeshTokens));
router.post('/create-an-album', accessPhotographersValidation, handleCallback(albumCreation));
router.post('/upload-photos-to-s3', accessPhotographersValidation, handleCallback(photoUpload));
router.post('/photos/:id', accessPhotographersValidation, handleCallback(addUsersOnPhoto));
router.post('/set-album-price/:album', accessAdminValidation, handleCallback(addAlbumPrice));
router.get('/all-albums', accessAdminValidation, handleCallback(albumsList));
router.get('/albums/:album', accessAdminValidation, handleCallback(getAlbum));
router.get('/ph-all', accessAdminValidation,  handleCallback(PhotographersList));

export default router;