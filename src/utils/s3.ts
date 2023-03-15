import AWS from 'aws-sdk';
export const s3 = new AWS.S3({
    region: "us-east-2",
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    signatureVersion: 'v4',
    apiVersion: '2006-03-01'
});
