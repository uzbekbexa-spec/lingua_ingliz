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

// DeepSeek API kalitini Render muhitidan o'qiymiz
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Iltimos, xabar yozing!" });
    }

    try {
        // Endi qolip emas, to'g'ridan-to'g'ri DeepSeek API ishlaydi!
        const aiResponse = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "Siz samimiy va tajribali ingliz tili o'qituvchisisiz. Foydalanuvchi nima yozsa, xuddi ChatGPT kabi erkin, qisqa va tushunarli qilib javob bering. Hech qanday uzun qoliplar yoki zerikarli shablonlar ishlatmang."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                stream: false
            })
        });

        const data = await aiResponse.json();

        if (data.choices && data.choices.length > 0) {
            const replyText = data.choices[0].message.content;
            res.json({ reply: replyText });
        } else {
            res.status(500).json({ reply: "AI javob berishda xatolik yuz berdi." });
        }

    } catch (error) {
        console.error("DeepSeek xatosi:", error);
        res.status(500).json({ reply: "Serverda ulanish xatosi yuz berdi." });
    }
});

// Botni xavfsiz ishga tushirish (server qulab tushmasligi uchun)
bot.launch().then(() => {
    console.log("Telegram bot muvaffaqiyatli ishga tushdi!");
}).catch(err => {
    console.error("Botni ishga tushirishda xatolik (lekin server ishlayveradi):", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ishlayapti: ${PORT}`);
});