// import { RequestHandler } from "express";
// import { s3 } from "../utils/s3";
// import { getUserByPhone } from "../db/services/usersService";
// import dotenv from "dotenv";
// dotenv.config();

// export const  selfieUpload: RequestHandler = async (req, res) => {
//   const usPhone: string = req.params.phone;
//   const usrInDB = await getUserByPhone(usPhone);
//   if (!usrInDB.length) {
//     return res.status(404).json({
//       status: 404,
//       message: `We don't have phone ${usPhone} at our database.`
//     });
//   }
//   let genKey = Date.now() +"-"+ Math.floor(100000 + Math.random() * 900000).toString()+'.jpeg'
//   const s3Params = {
//     Bucket: process.env.AWS_BUCKET,
//     Key: genKey,
//     ContentType: 'image/*', // Change this to the media type of the files you want to upload
//     Expires: 5 * 60
//   }
//   let uploadURL = s3.getSignedUrl('putObject', s3Params)
//   return res.header({"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true})
//     .status(200).json({
//       status: 200,
//       method: "PUT",
//       url: uploadURL,
//       selfie: `https://framology9-image.s3.us-east-2.amazonaws.com/${genKey}`
//     });
// };  ***Didn't work lambda function with local DB***