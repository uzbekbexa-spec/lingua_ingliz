const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = '8759405828:AAF4xzXch8GzFRJ5pbAlOyzgxM_5yxN-oKg';
const OPENAI_API_KEY = "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";

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
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Siz samimiy va tajribali ingliz tili o'qituvchisisiz. Foydalanuvchi nima yozsa, xuddi ChatGPT kabi erkin, qisqa va tushunarli qilib javob bering. Hech qanday uzun qoliplar yoki zerikarli shablonlar ishlatmang."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ]
            })
        });

        const data = await openaiResponse.json();

        if (data.choices && data.choices[0]?.message?.content) {
            const replyText = data.choices[0].message.content;
            res.json({ reply: replyText });
        } else if (data.error) {
            res.status(500).json({ reply: "OpenAI xatosi: " + data.error.message });
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
