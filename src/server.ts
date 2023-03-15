import express, { json } from "express";
import Routes from "./routers/routers";
import * as dotenv from "dotenv";
import { db } from "./db/db";
import { eq } from "drizzle-orm/expressions";
import cors  from "cors";
import { tableFVerify } from './db/schema/verify';
import { corsOptions } from "./utils/cors";
dotenv.config({ path: __dirname+"/.env" });
import { bot } from "./utils/bot";
import { getVerify } from "./db/services/verifyService";
import { getUserByPhone } from "./db/services/usersService";

const port = Number(process.env.PORT);
const host = process.env.HOST as string;
const app = express();

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(json());
app.use(express.urlencoded({ extended: false }));
app.use("/", Routes);

bot.onText(/\/getCode (.+)/, async (msg: { chat: { id: number } }, match) => {
  const code: string = Math.floor(100000 + Math.random() * 900000).toString();  // Generating random six numbers
  const chatId: number = msg.chat.id;
  const time: number = new Date().getTime() / 1000 // Creating & adding timestamp
  if (match != null) {
    const phone = match[1]
    const userInDB = await getUserByPhone(phone);
    if (!userInDB.length) {
      bot.sendMessage(chatId, "User with that number dosen't exist");
    }
    const verufyingResult = await getVerify(phone);
    if (!verufyingResult.length) {  // Control check if it's first attempt
      await db.insert(tableFVerify).values({  // Because of ability to verify user from 1 chat id, look up if telegram chat not verify anyone. We create DB row.
        telegramid: chatId.toString(),
        verifycode:  code,
        timestamp: time,
        trycount: 1,
        phone: phone
      });
      bot.sendMessage(chatId, code);
      bot.sendMessage(chatId, "Success. You have only 3 minutes.");
    } else if (Number(verufyingResult[0].trycount) >= 1) {  // If attempt not first guiding to get second code
      bot.sendMessage(chatId, "You must click resend code.")
    } else if (verufyingResult.length) {
      bot.sendMessage(chatId, code);
      bot.sendMessage(chatId, "Success. You have only 3 minutes.");
      await db.update(tableFVerify).set({ telegramid: chatId.toString(), verifycode: code, timestamp: time, trycount: 1})
      .where(eq(tableFVerify.phone, phone));  // else if  telegram chat verify someone, updating DB row with control numbers.
    }
  }
});

app.listen(port,host, () => {
  console.log(`Running at http://${host}:${port}`);
});
