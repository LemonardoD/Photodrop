import { Router } from "express";   
import {refeshTokens, insertPhotographer, loginPhotographer } from "../controllers/controllerRegLog";
import cookieParser from "cookie-parser";
import { albumCreation, albumsList } from "../controllers/controllerAlbums";
import { PhotographersList, activatePhotographer, addAlbumPrice, addUsersOnPhoto, getAlbum } from "../controllers/controllerAdmin";
import { photoUpload } from "../controllers/controllerImgupload";

const router = Router();
router.use(cookieParser());

router.post('/ph-register', insertPhotographer);
router.put('/ph-activate', activatePhotographer);
router.post('/ph-login', loginPhotographer);
router.post('/refresh-ph-tokens', refeshTokens);
router.post('/create-an-album', albumCreation);
router.post('/upload-photos-to-s3', photoUpload);
router.post('/photos/:id', addUsersOnPhoto);
router.post('/set-album-price/:album', addAlbumPrice);
router.get('/all-albums', albumsList);
router.get('/albums/:album', getAlbum);
router.get('/ph-all', PhotographersList);

export default router;