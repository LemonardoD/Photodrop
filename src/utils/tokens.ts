import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname+"/.env" });

export const acToken = process.env.JWT_SECRET_ACCES as string;
export const rfToken = process.env.JWT_SECRET_REFRESH as string;