import { Response, Request } from "express";
import dotenv from "dotenv";
dotenv.config();
import { createFileName, pathVariation, uploads3Multiple } from "../utils/multer";
import { ResponseUsersOnImg, addUsersOnPhotoReq } from "../DTO/middlewaresDTO";
import ImgRepo from "../db/repositories/imageRepo";
import AlRepo from "../db/repositories/albumRepo";

export const addUsersOnPhoto = async (req: addUsersOnPhotoReq, res: Response) => {
    const { id } = req.params;
    const { users } = req.body;
    await ImgRepo.addClientsToImage(id, users);
    return res.status(200).json({
        status: 200,
        message: `${users} were marched on this photo.`,
    });
};

export const photoUpload = async (req: Request, res: ResponseUsersOnImg) => {
    uploads3Multiple(req, res, async () => {
        const { album } = req.body;
        const uploadingFiles = req.files as Express.MulterS3.File[];
        const usrOnPhoto = res.locals.users;
        if (usrOnPhoto) {
            for (let i = 0; i < uploadingFiles.length; i++) {
                const fileName = createFileName(uploadingFiles[i].originalname); // Creating img name with date stamp
                const paths = pathVariation(uploadingFiles[i].location);
                if (usrOnPhoto[i].length) {
                    await ImgRepo.insertImage({
                        // Saving image info in DB with marked users
                        client: usrOnPhoto[i],
                        album,
                        imgname: fileName,
                        inbucket: 1,
                        path: paths.orgPath,
                        wtrpath: paths.wtrPath,
                        resizerpath: paths.resizedPath,
                        reswtrmpath: paths.resWtrPath,
                    });
                }
                await ImgRepo.insertImage({
                    album,
                    imgname: fileName,
                    inbucket: 1,
                    path: paths.orgPath,
                    wtrpath: paths.wtrPath,
                    resizerpath: paths.resizedPath,
                    reswtrmpath: paths.resWtrPath,
                });
                await AlRepo.updateAlbumMainPhoto(album, paths.orgPath); // Updating main album img
            }
            return res.status(201).json({
                status: 201,
                message: `Successfully uploaded ${uploadingFiles.length} files! With users!`,
            });
        }
        for (let i = 0; i < uploadingFiles.length; i++) {
            const imgInDB = await ImgRepo.getImageByLikeText(uploadingFiles[i].originalname);
            if (!imgInDB) {
                // Control check by name if photo already uploaded
                const fileName = createFileName(uploadingFiles[i].originalname);
                const paths = pathVariation(uploadingFiles[i].location);
                await ImgRepo.insertImage({
                    // Saving image info in DB
                    album,
                    imgname: fileName,
                    inbucket: 1,
                    path: paths.orgPath,
                    wtrpath: paths.wtrPath,
                    resizerpath: paths.resizedPath,
                    reswtrmpath: paths.resWtrPath,
                });
                await AlRepo.updateAlbumMainPhoto(album, paths.orgPath);
            }
        }
        return res.status(201).json({
            status: 201,
            message: `Successfully uploaded ${uploadingFiles.length} files! Without users.`,
        });
    });
};
