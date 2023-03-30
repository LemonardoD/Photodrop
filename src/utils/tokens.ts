import * as dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

export const acToken = process.env.JWT_SECRET_ACCES as string;
export const rfToken = process.env.JWT_SECRET_REFRESH as string;
// Creating  access token
export async function accessTokenCreation(phone:string):Promise<string> {
    return jwt.sign({data: phone}, acToken, {expiresIn: "30m"});
};
// Creating refresh token
export async function refreshTokenCreation(phone:string):Promise<string> {
    return jwt.sign({data: phone}, rfToken, {expiresIn: "1d"});
};