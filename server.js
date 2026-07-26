const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '8759405828:AAF4xzXch8GzFRJ5pbAlOyzgxM_5yxN-oKg';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: "Siz samimiy va tajribali ingliz tili o'qituvchisisiz. Foydalanuvchi nima yozsa, xuddi ChatGPT kabi erkin, qisqa va tushunarli qilib javob bering. Hech qanday uzun qoliplar yoki zerikarli shablonlar ishlatmang. Foydalanuvchi xabari: " + userMessage }
                        ]
                    }
                ]
            })
        });

        const data = await geminiResponse.json();

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const replyText = data.candidates[0].content.parts[0].text;
            res.json({ reply: replyText });
        } else if (data.error) {
            res.status(500).json({ reply: "Gemini xatosi: " + data.error.message });
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
