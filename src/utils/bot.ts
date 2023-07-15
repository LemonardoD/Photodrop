import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { getUserByName } from "../db/repositories/userRepo";
dotenv.config();

const botToken = process.env.BOT_TOKEN as string;
export const bot = new TelegramBot(botToken, { polling: true });

export async function botMessSender(users: string) {
    const uniqUsers = [...new Set(users.replaceAll(",", "*").split("*"))]; // Create arr with unik users
    for (let i = 0; i < uniqUsers.length; i++) {
        // Search every usr in db
        const userInDB = await getUserByName(uniqUsers[i]);
        if (userInDB.length && userInDB[0].telebotNum != null) {
            try {
                bot.sendMessage(userInDB[0].telebotNum, "Photo Drop. U got new photos!"); // *SMS NOTIF*
            } catch (err) {
                console.log(err);
            }
        }
    }
}
