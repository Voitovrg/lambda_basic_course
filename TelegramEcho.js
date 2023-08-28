// 4. CLI: Telegram Echo [ F | B ]
// @RV_Telegram_Echo_bot

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6381212469:AAHN6OWxwvQGlR3F_sA9t2v5TEEg1hP3unk';
const bot = new TelegramBot(token, {polling: true});

// Обработчик входящих сообщений
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Если сообщение содержит команду 'photo', отправляем случайную картинку
    if (messageText === 'photo') {
        try {
            const response = await axios.get('https://picsum.photos/200/300', {responseType: 'arraybuffer'});
            const imageBuffer = Buffer.from(response.data, 'binary');
            bot.sendPhoto(chatId, imageBuffer)
                .then(() => {
                    console.log('Пользователь запросил картинку')
                })
                .catch((error) => {
                    console.log('!!!Error!!!', error)
                })
        } catch (error) {
            console.error('Error sending photo:', error);
        }
    } else {
        bot.sendMessage(chatId, `You wrote: ${messageText}`)
        console.log(`Received message from user: ${messageText}`);

    }
});
