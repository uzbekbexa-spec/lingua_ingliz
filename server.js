const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '8759405828:AAF4xzXch8GzFRJ5pbAlOyzgxM_5yxN-oKg';
const bot = new Telegraf(BOT_TOKEN);
const app = express();

// JSON ma'lumotlarni o'qish uchun middleware
app.expressjson ? app.use(express.json()) : app.use(express.json()); // Standart express.json()
app.use(express.static(path.join(__dirname, 'public')));

bot.start((ctx) => {
    ctx.reply(
        'Xush kelibsiz!',
        Markup.inlineKeyboard([
            [Markup.button.webApp('Mini Appni Ochish', 'https://lingua-ingliz.onrender.com')]
        ])
    );
});

// Mini App ichidan keladigan AI so'rovlarini qabul qilish uchun API yo'li
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Iltimos, xabar yozing!" });
    }

    try {
        // Bu yerda AIning javobini shakllantiramiz (Hozircha o'qituvchi ruhidagi aqlli javob mexanizmi)
        // Kelgusida bu yerga OpenAI yoki DeepSeek API kalitini ulab yuboramiz.
        
        let aiReply = `💡 **Anti-Kalaka AI Tahlili:**\n\n` +
                      `Sizning " ${userMessage} " degan xabaringiz qabul qilindi.\n\n` +
                      `✍️ **Writing & Speaking maslahati:** Ingliz tilida buni biroz tabiiyroq qilib quyidagicha aytish tavsiya qilinadi...\n` +
                      `📚 **Vocabulary:** Ushbu vaziyatda "advanced" so'zlardan foydalanish yodingizdan chiqmasin.\n` +
                      `🇺🇸 **Native Culture:** Amerikaliklar bu holatda jonli tilda boshqacha ibora ishlatishadi.\n\n` +
                      `😊 Xafa bo'lmang, harakatdan to'xtamang, siz buni uddalaysiz!`;

        res.json({ reply: aiReply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Serverda xatolik yuz berdi, birozdan so'ng urinib ko'ring." });
    }
});

bot.launch();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ishlayapti: ${PORT}`);
});