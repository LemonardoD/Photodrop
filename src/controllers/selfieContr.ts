import { Request } from "express";
import { bucket, createFileName, s3 } from "../utils/mutler";
import { MyResponse } from "./types";

export const selfieUpload = async (req: Request, res: MyResponse) => {
    const { phone } = res.locals;
    const keyName = createFileName(phone);
    const s3Params = {
        Bucket: bucket,
        Key: keyName,
        ContentType: "image/*", // Change this to the media type of the files you want to upload
        Expires: 5 * 60,
    };
    const uploadURL = s3.getSignedUrl("putObject", s3Params);
    return res.status(200).json({
        status: 200,
        method: "PUT",
        url: uploadURL,
        selfie: `https://framology9-image.s3.us-east-2.amazonaws.com/${keyName}`,
    });
};
