import multerS3 from "multer-s3";
import multer  from "multer";
import { S3Client } from "@aws-sdk/client-s3";

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