// 5. TelegramBot: прогноз погоды [ F | B ]
// 6. TelegramBot: курс валют [ F | B ]
// @RV_Telegram_Exchange_bot

const TelegramBot = require('node-telegram-bot-api');
const token = '6084438958:AAEH9u97qT5oKtz5HOn23dGLOy3IcwbYPO4'
const bot = new TelegramBot(token, {polling: true});
const axios = require('axios')

console.log('Bot has started...')

let intervalWeather = 0;
let bankUser; // Какой банк интересует пользователя
let currencyUser; // Какая валюта интересует пользователя
let currencyData = null; // Переменная для хранения результата запроса

let urlPrivatBank = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
let urlMonoBank = 'https://api.monobank.ua/bank/currency';

const fetchData = () => {
    axios.get(urlMonoBank)
        .then(response => {
            currencyData = response.data;
            console.log('Данные обновлены:');
        })
        .catch(error => {
            console.error('Ошибка при получении данных MONO:', error);
        });
};

fetchData();
const interval = setInterval(fetchData, 5 * 60 * 1001);

bot.onText(/\/start/, msg => {
    let text = msg.text;
    const msgID = msg.chat.id;

    const message = 'Hi, would you like to know the "*_weather_*" or the "*_exchange rate_*"?'

    bot.sendMessage(msgID, message, {
        parse_mode: 'MarkdownV2',
        reply_markup: {keyboard: [['Weather'], ['Exchange rate']]}
    });

    bot.on('message', msg => {
        text = msg.text;

        if (text === 'Weather') {
            bot.sendMessage(msgID, `You choice ${text}\n\nWhat time interval are you interested in?)`, {
                reply_markup: {
                    keyboard: [['Every 3 hours', 'Every 6 hours'], ['Back']]
                }
            })
        }
        if (text === 'Every 3 hours' || text === 'Every 6 hours') {

            intervalWeather = parseInt(text.match(/\d+/))
            bot.sendMessage(msgID, `Okay, the interval will be every ${intervalWeather} hours.\n\nBut I need to know where you are:)`, {
                reply_markup: {
                    keyboard: [[{
                        text: 'Send location', request_location: true
                    }], ['Change interval', 'Back to start']]
                }
            })
        }
        if (text === 'Change interval') {
            bot.sendMessage(msgID, 'What time interval are you interested in?)', {
                reply_markup: {
                    keyboard: [['Every 3 hours', 'Every 6 hours'], ['Back']]
                }
            })
        }
        if (text === 'Back to start') {
            bot.sendMessage(msgID, 'Back to start', {
                reply_markup: {
                    keyboard: [['Weather'], ['Exchange rate']]
                }
            })
        }
        if (text === 'Exchange rate') {
            bot.sendMessage(msgID, 'What currency are you interested in?', {
                reply_markup: {
                    keyboard: [['EUR', 'USD'], ['Back']]
                }
            })
        }
        if (text === 'EUR' || text === 'USD') {
            currencyUser = text
            bot.sendMessage(msgID, 'What bank are you interested in?', {
                reply_markup: {
                    keyboard: [['PrivatBank', 'MonoBank'], ['All Bank'], ['Back to start', 'Change currency']]
                }
            })
        }
        if (text === 'Back') {
            bot.sendMessage(msgID, 'Let\'s start over.', {
                reply_markup: {
                    keyboard: [['Weather'], ['Exchange rate']]
                }
            })
        }
        if (text === 'Change currency') {
            bot.sendMessage(msgID, 'What currency are you interested in?', {
                reply_markup: {
                    keyboard: [['EUR', 'USD'], ['Back']]
                }
            })
        }
        if (text === 'PrivatBank') {
            bankUser = text
            axios.get(urlPrivatBank).then(response => {
                const jsonData = response.data;
                const currency = jsonData.find(i => i.ccy === currencyUser)

                if (currency) {
                    const message = `${bankUser}:\n${currency.ccy}:\nBuy: ${currency.buy}\nSale: ${currency.sale}`
                    bot.sendMessage(msgID, message, {
                        reply_markup: {
                            keyboard: [['Weather'], ['Exchange rate']]
                        }
                    })
                }
            })
        }
        if (text === 'MonoBank') {
            bankUser = text

            let monoCurrencyA;
            let monoCurrencyB;

            if (currencyUser === 'USD') {
                monoCurrencyA = 840
                monoCurrencyB = 980
            }
            if (currencyUser === 'EUR') {
                monoCurrencyA = 978
                monoCurrencyB = 980
            }

            if (currencyData) {
                const currency = currencyData.find(item => item.currencyCodeA === monoCurrencyA && item.currencyCodeB === monoCurrencyB);

                if (currency) {
                    const message = `${bankUser}:\n${currencyUser}:\nBuy:${currency.rateBuy}\nSale:${currency.rateSell}`
                    bot.sendMessage(msgID, message, {
                        reply_markup: {
                            keyboard: [['Weather'], ['Exchange rate']]
                        }
                    })
                }
            }
        }
        if (text === 'All Bank') {
            axios.get(urlPrivatBank).then(response => {
                const jsonData = response.data;
                const currency = jsonData.find(i => i.ccy === currencyUser)

                if (currency) {
                    const message = `PrivatBank:\n${currency.ccy}:\nBuy: ${currency.buy}\nSale: ${currency.sale}`
                    bot.sendMessage(msgID, message, {
                        reply_markup: {
                            keyboard: [['Weather'], ['Exchange rate']]
                        }
                    })
                }
            })

            let monoCurrencyA;
            let monoCurrencyB;


            if (currencyUser === 'USD') {
                monoCurrencyA = 840
                monoCurrencyB = 980
            }
            if (currencyUser === 'EUR') {
                monoCurrencyA = 978
                monoCurrencyB = 980
            }

            if (currencyData) {
                const currency = currencyData.find(item => item.currencyCodeA === monoCurrencyA && item.currencyCodeB === monoCurrencyB);

                if (currency) {
                    const message = `MonoBank:\n${currencyUser}:\nBuy:${currency.rateBuy}\nSale:${currency.rateSell}`
                    bot.sendMessage(msgID, message, {
                        reply_markup: {
                            keyboard: [['Weather'], ['Exchange rate']]
                        }
                    })
                }
            }
        }
    })
    bot.on('location', async msg => {
        const {latitude, longitude} = msg.location;
        const chatId = msg.chat.id;

        console.log('User location:', latitude, longitude);

        const apiKey = '91f9e3b56ca52c06e239d497d32616b6';
        const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        axios.get(url)
            .then(response => {
                const data = response.data;
                const forecastsByDate = {};

                data.list.forEach(entry => {
                    const date = new Date(entry.dt * 1000);
                    const forecastDate = date.toLocaleDateString('en-EN', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    });
                    const formattedDate = forecastDate.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                    // Определение временных отрезков в зависимости от выбранного временного шага
                    const timeIntervals = intervalWeather === 3 ? ['03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'] : ['06:00', '12:00', '18:00', '21:00'];

                    // Проверка, соответствует ли время одному из временных отрезков
                    if (timeIntervals.includes(time)) {
                        const temperature = Math.round(entry.main.temp - 273.15);
                        const feelsLike = Math.round(entry.main.feels_like - 273.15);
                        const weatherDescription = entry.weather[0].description;

                        if (!forecastsByDate[formattedDate]) {
                            forecastsByDate[formattedDate] = [];
                        }

                        forecastsByDate[formattedDate].push(`${time}: Temperature: ${temperature}°C, Feels like: ${feelsLike}°C, ${weatherDescription}`);
                    }
                });

                // Отправка прогноза погоды пользователю одним сообщением
                let forecastMessage = 'Weather forecast for your city:\n\n'; // Замените "вашего города" на название города, если оно доступно
                for (const date in forecastsByDate) {
                    forecastMessage += `${date}\n${forecastsByDate[date].join('\n')}\n\n`;
                }
                bot.sendMessage(chatId, forecastMessage);
            })
            .catch(error => {
                console.error(`Ошибка при выполнении запроса: ${error}`);
            });
    });


})
