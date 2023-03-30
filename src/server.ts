import express from "express";
import Routes from "./routers/routers"; 
import { json } from "body-parser";
import dotenv from "dotenv";
import cors  from "cors";
dotenv.config();

const app = express();
app.use(cors());
const port = Number(process.env.PORT);
const host = process.env.HOST as string;
export const botToken = process.env.BOT_TOKEN as string;
export const bucket = process.env.AWS_BUCKET as string;

app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use("/", Routes);

app.listen(port, host,() => {
  console.log(`Running at http://${host}:${port}`);
});
