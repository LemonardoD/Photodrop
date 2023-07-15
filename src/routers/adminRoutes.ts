import { Router } from "express";
import { errHandl } from "../middlewares/errHandler";
import { accessAdmin } from "../middlewares/tokenAccess";
import { ifAlbumExist, ifUserExist, priceVal } from "../middlewares/controllersValidation/adminsMid";
import { AllPhotographers, activatePhotographer, addAlbumPrice, getSpecificAlbum } from "../controllers/adminContr";
import { albumsList } from "../controllers/albumsContr";

const adminRouter = Router();

adminRouter.put("/ph-activate", errHandl(accessAdmin), errHandl(ifUserExist), errHandl(activatePhotographer));
adminRouter.get("/ph-all", errHandl(accessAdmin), errHandl(AllPhotographers));
adminRouter.get("/all-albums", errHandl(accessAdmin), errHandl(albumsList));
adminRouter.get("/albums/:albumName", errHandl(accessAdmin), errHandl(ifAlbumExist), errHandl(getSpecificAlbum));
adminRouter.post(
    "/set-album-price/:albumName",
    errHandl(accessAdmin),
    errHandl(ifAlbumExist),
    errHandl(priceVal),
    errHandl(addAlbumPrice)
);

export default adminRouter;
