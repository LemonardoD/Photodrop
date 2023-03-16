import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config({ path: __dirname+"/.env" });

const botToken = process.env.BOT_TOKEN as string;
export const bot = new TelegramBot(botToken, {polling: true});