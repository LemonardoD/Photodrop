import { PhotosInfo, AllPhotosFromDB } from "../controllers/types";

export const phArrMapping = (phArr: AllPhotosFromDB[], paymentArr: (string | null)[]): PhotosInfo[] => {
    return phArr.map((el) => {
        if (paymentArr.includes(el.PhId.toString())) {
            return {
                album: el.album,
                path: el.path,
                resizedPath: el.resizedPath,
                phId: el.PhId,
            };
        }
        if (paymentArr.includes(el.album.toLowerCase())) {
            return {
                album: el.album,
                path: el.path,
                resizedPath: el.resizedPath,
                phId: el.PhId,
            };
        }
        return {
            album: el.album,
            path: el.pathWtr,
            resizedPath: el.resizedPathWtr,
            phId: el.PhId,
        };
    });
};
