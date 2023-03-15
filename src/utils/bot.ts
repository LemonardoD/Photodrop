import TelegramBot from "node-telegram-bot-api";

const botToken = process.env.BOT_TOKEN as string;
export const bot = new TelegramBot(botToken, {polling: true});