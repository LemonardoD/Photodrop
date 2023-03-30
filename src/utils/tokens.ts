import * as dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

export const acToken = process.env.JWT_SECRET_ACCES as string;
export const rfToken = process.env.JWT_SECRET_REFRESH as string;
// Creating  access token
export async function accessTokenCreation(login:string):Promise<string> {
    return jwt.sign({data: login}, acToken, {expiresIn: "30m"});
};
// Creating refresh token
export async function refreshTokenCreation(login:string):Promise<string> {
    return jwt.sign({data: login}, rfToken, {expiresIn: "1d"});
};