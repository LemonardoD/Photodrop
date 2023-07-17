import AWS from "aws-sdk";
import Jimp from "jimp";

const s3 = new AWS.S3({
    accessKeyId: "",
    secretAccessKey: "",
});
export async function handler(event) {
    const key = event.Records[0].s3.object.key;
    const jimpWtrm = await Jimp.read(
        `https://framology-watermark.s3.us-east-2.amazonaws.com/photo_2023-03-15_10-47-23.jpg`
    );
    const jimpImg4w = await Jimp.read(`https://framology9user-image.s3.us-east-2.amazonaws.com/${key}`);
    const jimpImg4r = await Jimp.read(`https://framology9user-image.s3.us-east-2.amazonaws.com/${key}`);
    const resizedWtrm = jimpWtrm.scaleToFit(jimpImg4w.bitmap.width / 2, jimpImg4w.bitmap.height / 2);
    const placementWidht = (jimpImg4w.bitmap.width - resizedWtrm.bitmap.width) / 2;
    const placementHeight = (jimpImg4w.bitmap.height - resizedWtrm.bitmap.width) / 2;
    const watermr = jimpImg4w.composite(resizedWtrm, placementWidht, placementHeight, {
        mode: Jimp.BLEND_MULTIPLY,
        opacitySource: 1,
        opacityDest: 1,
    });
    const mimeWtrm = watermr.getMIME();
    const WatermarkedImg = await watermr.getBufferAsync(mimeWtrm);
    const destparamsWtrm = {
        Bucket: "framology-watermark",
        Key: key,
        Body: WatermarkedImg,
    };
    await s3.putObject(destparamsWtrm).promise();
    const mimerz = jimpImg4w.getMIME();
    const resizedImgWtrm = await jimpImg4w.scaleToFit(300, 300).getBufferAsync(mimerz);
    const destparamsResizewtr = {
        Bucket: "framology-wtrmresized",
        Key: key,
        Body: resizedImgWtrm,
    };
    await s3.putObject(destparamsResizewtr).promise();
    const mime = jimpImg4r.getMIME();
    const resizedImg = await jimpImg4r.scaleToFit(300, 300).getBufferAsync(mime);
    const destparamsResize = {
        Bucket: "framology-imageresized",
        Key: key,
        Body: resizedImg,
    };
    await s3.putObject(destparamsResize).promise();
}
