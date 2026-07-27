const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '8759405828:AAF4xzXch8GzFRJ5pbAlOyzgxM_5yxN-oKg';

const bot = new Telegraf(BOT_TOKEN);
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    ctx.reply(
        'Xush kelibsiz!',
        Markup.inlineKeyboard([
            [Markup.button.webApp('Mini Appni Ochish', 'https://lingua-ingliz.onrender.com')]
        ])
    );
});

bot.launch().then(() => {
    console.log("Telegram bot muvaffaqiyatli ishga tushdi!");
}).catch(err => {
    console.error("Botni ishga tushirishda xatolik:", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ishlayapti: ${PORT}`);
});
