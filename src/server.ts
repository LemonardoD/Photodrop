import express, { response } from "express";
import Routes from "./routers/routers"; 
import { json } from "body-parser";
import dotenv from "dotenv";
import cors  from "cors";
dotenv.config();
import { corsOptions } from "./utils/cors";

const app = express();
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
const port = Number(process.env.PORT);
const host = process.env.HOST as string;
export const botToken = process.env.BOT_TOKEN as string;
export const bucket = process.env.AWS_BUCKET as string;

app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use((err: Error, req:express.Request, res:express.Response, next:express.NextFunction)=>{
    response.status(500).json({
        status: 500,
        message: err.message
    })
});
app.use("/", Routes);

app.listen(port, host,() => {
  console.log(`Running at http://${host}:${port}`);
});
