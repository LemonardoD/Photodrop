import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";

export const s3 = new S3Client({ region: process.env.REGION });

const maxSixNumValue = 999999;
export function createFileName(name: string) {
    return Date.now() + "-" + Math.floor(Math.random() * maxSixNumValue) + name;
}

export function pathVariation(path: string): { orgPath: string; wtrPath: string; resizedPath: string; resWtrPath: string } {
    return {
        orgPath: path,
        wtrPath: path.replace(
            "https://framology9user-image.s3.us-east-2.amazonaws.com/",
            "https://framology-watermark.s3.us-east-2.amazonaws.com/"
        ),
        resizedPath: path.replace(
            "https://framology9user-image.s3.us-east-2.amazonaws.com/",
            "https://framology-imageresized.s3.us-east-2.amazonaws.com/"
        ),
        resWtrPath: path.replace(
            "https://framology9user-image.s3.us-east-2.amazonaws.com/",
            "https://framology-wtrmresized.s3.us-east-2.amazonaws.com/"
        ),
    };
}

export const uploads3Multiple = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET as string,
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: createFileName(file.originalname),
            });
        },
        key: function (req, file, cb) {
            cb(null, createFileName(file.originalname));
        },
    }),
}).array("photos", 20); // function for multiple image upload on s3 bucket

export const s3keys = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID as string,
    secretAccessKey: process.env.AWS_SECRET as string,
});
