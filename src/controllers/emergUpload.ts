import { RequestHandler } from "express";
import { getUserByPhone, updateSelfiePath } from "../db/services/usersService";
import { insertNewUserimages } from "../db/services/usrImagesService";
import { uploads3 } from "../utils/mutler";


export const selfieUpload: RequestHandler = async (req, res) => {
  const usPhone: string = req.params.phone;
  const usrInDB = await getUserByPhone(usPhone);
  if (!usrInDB.length) {
    return res.status(404).json({
      status: 404,
      message: `We don't have phone ${usPhone} at our database.`
    });
  }
  uploads3(req, res, async ()=>{
    if(!req.files){
      return res.status(406).json({ 
        status: 406,
        message: "You must attach photos!"
      });
    }
    const file = req.file as Express.MulterS3.File;
    await updateSelfiePath(usPhone, file.location);
    await insertNewUserimages({
      phone: usPhone,
      photopath: file.location,
    });
    return res.status(201).json({
      status: 201,
      message: "Selfie added!",
      selfie: file.location
    });
  })
}

    