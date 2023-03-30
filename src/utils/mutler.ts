import multer  from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";

export const s3 = new S3Client({ region: process.env.REGION });

export const uploads3Multiple = multer({ 
  storage: multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET as string,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: Date.now() +"-"+ Math.floor(100000 + Math.random() * 900000).toString()+ file.originalname });
  },
  key: function (req, file, cb) {
    cb(null,  Date.now() +"-"+ Math.floor(100000 + Math.random() * 900000).toString()+ file.originalname )
  }})
}).array("photos", 20);  // function for multiple image upload on s3 bucket

export const s3keys = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_ID as string,
  secretAccessKey: process.env.AWS_SECRET as string,
});