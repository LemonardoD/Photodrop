import { RequestHandler } from "express";
import dotenv from "dotenv";
dotenv.config();
import { bot } from "../utils/bot";
import { getAlbumInfo, updateMainPhoto } from "../db/services/albumServ";
import { uploads3Multiple } from "../utils/mutler";
import { getImageByLikeText, insertImage } from "../db/services/imageServices";
import { getUser } from "../db/services/userServ";

export const photoUpload: RequestHandler = async (req, res) => {
  uploads3Multiple(req, res, async ()=>{  // Field names validation 4 mutler
  if(!req.files){
    return res.status(406).json({ 
      status: 406,
      message: "You must attach photos!"
    });
  }
  if(!req.body.album){
    return res.status(406).json({ 
      status: 406,
      message: "Album name are required!"
    });
  }
  const albumInDB = await getAlbumInfo(req.body.album);  // Album name validation
  if(!albumInDB.length){
    return res.status(404).json({ 
      status: 404,
      message: `There is no album with such name ${req.body.album}.`
    });
  }
  const uploadingFiles = req.files as Express.MulterS3.File[];
  const usrOnPhoto: string | undefined = req.body.users;
  if (usrOnPhoto != undefined && usrOnPhoto.replaceAll("default", "") != undefined) {    // Control check if users were marked
      let uniqUsrs = [...new Set(usrOnPhoto.replaceAll(",", "*").split("*"))]  // Create arr with unik users
      for (let i = 0; i < uniqUsrs.length; i++) {  // Search every usr in db
          const usrInDB = await getUser(uniqUsrs[i]);
          if (usrInDB.length && usrInDB[0].telebotnum != null) {
          try {
              bot.sendMessage(usrInDB[0].telebotnum, "Photo Drop. U got new photos!")  // *SMS NOTIF* 
          } catch (err) {
              console.log(err)
          }
          }
      }
      let arrUsrsOnPhoto = usrOnPhoto.split("*");
      for (let i = 0; i < uploadingFiles.length; i++) {
        const fileName = Date.now() +"-"+ Math.floor(100000 + Math.random() * 900000).toString() + uploadingFiles[i].originalname; // Creating img name with date stamp
        if (arrUsrsOnPhoto[i].length && usrOnPhoto != "default") {
          await insertImage({  // Saving image info in DB with marked users
            client: arrUsrsOnPhoto[i],
            album: req.body.album,
            imgname: fileName,
            inbucket: 1,
            path: uploadingFiles[i].location,
            wtrpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
            'https://framology-watermark.s3.us-east-2.amazonaws.com/'),
            resizerpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
            'https://framology-imageresized.s3.us-east-2.amazonaws.com/'),
            reswtrmpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
            'https://framology-wtrmresized.s3.us-east-2.amazonaws.com/'), 
          });
        } else {
          await insertImage({  // Saving image info in DB WO users
            album: req.body.album,
            imgname: fileName,
            inbucket: 1,
            path: uploadingFiles[i].location,
            wtrpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
            'https://framology-watermark.s3.us-east-2.amazonaws.com/'),
            resizerpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
            'https://framology-imageresized.s3.us-east-2.amazonaws.com/'),
            reswtrmpath: uploadingFiles[i].location.replace('https://fframology9user-image.s3.us-east-2.amazonaws.com/', 
            'https://framology-wtrmresized.s3.us-east-2.amazonaws.com/'), 
          });
        }                   
        await updateMainPhoto(req.body.album, uploadingFiles[i].location);    // Updating main album img
      }
      return res.status(201).json({ 
        status: 201,
        message: `Successfully uploaded ${uploadingFiles.length} files! With users!`
      }); 
  } else {
      for (let i = 0; i < uploadingFiles.length; i++) {
          const imgInDB = await getImageByLikeText(uploadingFiles[i].originalname);
          if (!imgInDB.length) {    // Control check by name if photo already uploaded
            let fileName = Date.now() +"-"+ Math.floor(100000 + Math.random() * 900000).toString() + uploadingFiles[i].originalname;    // Creating img name with date stamp
            await insertImage({  // Saving image info in DB
                album: req.body.album,
                imgname: fileName,
                inbucket: 1,
                path: uploadingFiles[i].location,
                wtrpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
                'https://framology-watermark.s3.us-east-2.amazonaws.com/'),
                resizerpath: uploadingFiles[i].location.replace('https://framology9user-image.s3.us-east-2.amazonaws.com/', 
                'https://framology-imageresized.s3.us-east-2.amazonaws.com/'),
                reswtrmpath: uploadingFiles[i].location.replace('https://fframology9user-image.s3.us-east-2.amazonaws.com/', 
                'https://framology-wtrmresized.s3.us-east-2.amazonaws.com/'), 
            });                    
            await updateMainPhoto(req.body.album, uploadingFiles[i].location);    // Updating main album img
          }
      }
      return res.status(201).json({ 
          status: 201,
          message: `Successfully uploaded ${uploadingFiles.length} files! Without users.`
      });  
  }
})
};