import express, { json } from "express";
import Routes from "./routers/routers";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const port = Number(process.env.PORT);
const host = process.env.HOST as string;
const app = express();

app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use("/", Routes);

app.listen(port, host, () => {
    console.log(`Running at http://${host}:${port}`);
});
