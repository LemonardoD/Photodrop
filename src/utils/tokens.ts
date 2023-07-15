import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const acToken = process.env.JWT_SECRET_ACCESS as string;
export const rfToken = process.env.JWT_SECRET_REFRESH as string;
// Creating  tokens
export async function tokenCreation(phone: string): Promise<{ access: string; refresh: string }> {
    return {
        access: jwt.sign({ data: phone }, acToken, { expiresIn: "30m" }),
        refresh: jwt.sign({ data: phone }, rfToken, { expiresIn: "1d" }),
    };
}
