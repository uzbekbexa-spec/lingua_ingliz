const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const BOT_TOKEN = '8759405828:AAF4xzXch8GzFRJ5pbAlOyzgxM_5yxN-oKg';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Iltimos, xabar yozing!" });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "Siz samimiy va tajribali ingliz tili o'qituvchisisiz. Foydalanuvchi nima yozsa, xuddi ChatGPT kabi erkin, qisqa va tushunarli qilib javob bering. Hech qanday uzun qoliplar yoki zerikarli shablonlar ishlatmang. Foydalanuvchi xabari: " + userMessage }
                    ]
                }
            ]
        });

        const replyText = response.text;
        if (replyText) {
            res.json({ reply: replyText });
        } else {
            res.status(500).json({ reply: "Javob formati xato keldi." });
        }

    } catch (error) {
        console.error("Server xatosi:", error);
        res.status(500).json({ reply: "Server xatosi: " + error.message });
    }
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
