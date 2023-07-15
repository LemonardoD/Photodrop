// import multerS3 from "multer-s3";
// import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";

export const bucket = process.env.AWS_BUCKET as string;

export const s3 = new AWS.S3({
    region: "us-east-2",
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    signatureVersion: "v4",
    apiVersion: "2006-03-01",
});

const maxSixNumValue = 999999;
export function createFileName(name: string) {
    return Date.now() + "-" + Math.floor(Math.random() * maxSixNumValue) + name;
}

// const s3Multer: S3Client = new S3Client({ region: process.env.REGION as string });

// export const uploads3 = multer({
//     storage: multerS3({
//         s3: s3Multer,
//         bucket: bucket,
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: createFileName(file.fieldname) });
//         },
//         key: function (req, file, cb) {
//             cb(null, createFileName(file.originalname));
//         },
//     }),
// }).single("selfie");
