import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
import UsRepo from "../db/repositories/usersRepo";
import VerifyRepo from "../db/repositories/verifyPhoneRepo";

export const bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });

export const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generating random six numbers
export const time = new Date().getTime() / 1000; // Creating & adding timestamp

bot.onText(/\/getCode (.+)/, async (msg: { chat: { id: number } }, match) => {
    const chatId: number = msg.chat.id;
    if (match != null) {
        const phone = match[1];
        const usInDB = await UsRepo.ifUserExist(phone);
        if (!usInDB) {
            bot.sendMessage(chatId, "User with that number doesn't exist");
        }
        const verifResult = await VerifyRepo.getVerifyInfo(phone);
        switch (verifResult.tryCount) {
            case 0:
                bot.sendMessage(chatId, `Success. You have only 3 minutes. To process this code:  ${code}`);
                await VerifyRepo.updatePhoneVerify(code, time, phone, 1);
                break;
            case 1:
                bot.sendMessage(chatId, "You must click resend code.");
                break;
            default:
                await VerifyRepo.insertPhoneVerify({
                    // Because of ability to verify user from 1 chat id, look up if telegram chat not verify anyone. We create DB row.
                    telegramId: chatId.toString(),
                    verifyCode: code,
                    timestamp: time,
                    tryCount: 1,
                    phone,
                });
                bot.sendMessage(chatId, `Success. You have only 3 minutes. To process this code:  ${code}`);
        }
    }
});
