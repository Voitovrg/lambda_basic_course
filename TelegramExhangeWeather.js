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

    bot.sendMessage(msgID, message, {parse_mode: 'MarkdownV2', reply_markup: {keyboard: [['Weather'],['Exchange rate']]}});

    bot.on('message', msg => {
        text = msg.text;

        if (text === 'Weather') {
            bot.sendMessage(msgID, `You choice ${text}\n\nWhat time interval are you interested in?)`, {
                reply_markup: {
                    keyboard: [['Every 3 hours', 'Every 6 hours'], ['Back']]
                }
            })}
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
        if ( text === 'Change currency') {
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
                            remove_keyboard: true
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
                            remove_keyboard: true
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
                            remove_keyboard: true
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
                            remove_keyboard: true
                        }
                    })
                }
            }
        }
    })
    bot.on('location', async msg => {
        const { latitude, longitude } = msg.location;
        const locationId = msg.chat.id;

        console.log('User location:', latitude, longitude);

        // Запрос на получение прогноза погоды с выбранным интервалом
        const apiKey = '1ab12cd70f17ed73f6473ac07fbc81e3'
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        try {
            const response = await axios.get(weatherUrl);
            const weatherData = response.data;

            // Обработка полученных данных и формирование ответа
            let message = '';

            // Создаем объект для группировки прогнозов по дням
            const forecastsByDate = {};


            const timeStep = intervalWeather

            for (const entry of weatherData.list) {
                const forecastDate = new Date(entry.dt * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                });

                if (!forecastsByDate[forecastDate]) {
                    forecastsByDate[forecastDate] = [];
                }

                const forecastTime = new Date(entry.dt * 1000).getHours();

                // Оставляем только прогнозы с заданным временным шагом (3 или 6 часов)
                if (forecastTime % timeStep === 0) {
                    const time = new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const temperature = Math.round(entry.main.temp - 273.15);
                    const feelsLike = Math.round(entry.main.feels_like - 273.15);
                    const weatherDescription = entry.weather[0].description;

                    forecastsByDate[forecastDate].push(`${time}: Temperature: ${temperature}°C, Feels like: ${feelsLike}°C, ${weatherDescription}`);
                }
            }

            // Формирование окончательного ответа с прогнозами на 5 дней
            for (const forecastDate in forecastsByDate) {
                message += `\n${forecastDate}:\n`;
                message += forecastsByDate[forecastDate].join('\n');
                message += '\n';
            }

            bot.sendMessage(locationId, message);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            bot.sendMessage(locationId, 'Sorry, something went wrong while fetching weather data.');
        }

    })
})