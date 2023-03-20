import multerS3 from "multer-s3";
import multer  from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { userimages } from "../db/schema/userimages";
import { db } from "../db/db";
import { users } from "../db/schema/users";
import { eq } from "drizzle-orm/expressions";
import { getUserByPhone, getUserByToken } from "../db/services/usersService";
import { acToken } from "../utils/tokens";
import { insertNewUserimages } from "../db/services/usrImagesService";


export const s3: S3Client = new S3Client({ region: process.env.REGION as string});

export const uploads3 = multer({
    storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET as string,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }})
}).single('selfie')


export const  selfieUpload: RequestHandler = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized."
        });
      }
      const accessToken: string = req.headers.authorization.replace("Bearer ", "");
      const tokenInDB = await getUserByToken(accessToken)
      if (!tokenInDB.length) {
        return res.status(404).json({
          status: 404,
          message: "Wrong token."
        });
      }
      jwt.verify(accessToken, acToken, async (err:  VerifyErrors | null) => {
        if (err) {
          return res.status(401).json({
            status: 401,
            message: "Unauthorized."
          });
        }
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
        await db.update(users).set({ selfiepath: file.location}).where(eq(users.phone, usPhone));
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
    })
}

    