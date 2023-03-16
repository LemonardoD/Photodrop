import { acToken } from "../utils/tokens";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { RequestHandler } from "express";
import { s3 } from "../utils/s3";
import { getUserByPhone, getUserByToken } from "../db/services/usersService";
import { users } from "../db/schema/users";
import { db } from "../db/db";
import { eq } from "drizzle-orm/expressions";
import dotenv from "dotenv";
import { insertNewUserimages } from "../db/services/usrImagesService";
dotenv.config();

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
  let genKey = Date.now() +"-"+ Math.floor(100000 + Math.random() * 900000).toString()+'.jpeg'
  const s3Params = {
    Bucket: process.env.AWS_BUCKET,
    Key: genKey,
    ContentType: 'image/*', // Change this to the media type of the files you want to upload
    Expires: 5 * 60
  }
  await db.update(users).set({ selfiepath: `https://framology9-image.s3.us-east-2.amazonaws.com/${genKey}`}).where(eq(users.phone, usPhone));
  await insertNewUserimages({
    phone: usPhone,
    photopath: `https://framology9-image.s3.us-east-2.amazonaws.com/${genKey}`,
  });
  let uploadURL = s3.getSignedUrl('putObject', s3Params)
  return res.header({"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true})
    .status(200).json({
      status: 200,
      method: "PUT",
      url: uploadURL,
      selfie: `https://framology9-image.s3.us-east-2.amazonaws.com/${genKey}`
    });
  });   
};