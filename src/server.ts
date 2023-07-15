import express from "express";
import signInUpRouter from "./routers/signInUpRoutes";
import adminRoutes from "./routers/adminRoutes";
import { json } from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import imgRoutes from "./routers/imgRoutes";
dotenv.config();

const app = express();
app.use(cors());

const { PORT, HOST } = <{ PORT: number; HOST: string }>(<unknown>process.env);

app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use("/", adminRoutes);
app.use("/", imgRoutes);
app.use("/", signInUpRouter);

app.listen(PORT, HOST, () => {
    console.log(`Running at http://${HOST}:${PORT}`);
});
