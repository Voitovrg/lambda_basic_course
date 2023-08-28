// 3. CLI: Telegram Console Sender [ F | B ]
// @RV_Telegram_Console_Sender_bot

const TelegramBot = require('node-telegram-bot-api');
const {program} = require('commander');
const packageJson = require('/package.json');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const token = '6352108935:AAFlzMQk1K0zl06xSV7WE_QpLecTl8JH8uE';
const bot = new TelegramBot(token, {polling: true});
const defaultChatId = 362494958

program
    .command('message <message>')
    .alias('m')
    .description('Send message to Telegram bot.')
    .action((message) => {
        bot.sendMessage(defaultChatId, message)
            .then(() => {
                process.exit();
            })
            .catch((error) => {
                console.error('Error when sending a message');
                process.exit(1);
            });
    });

program
    .command('path <path>')
    .alias('p')
    .description('Send photo to Telegram bot. Just drag and drop if console aft er p-flag')

    .action((photoPath) => {
        const fullPath = path.resolve(photoPath);
        if (program.verbose) {
            console.log('Отправка фотографии:', fullPath);
        }
        const photo = fs.readFileSync(fullPath);
        bot.sendPhoto(defaultChatId, photo)
            .then(() => {
                process.exit();
            })
            .catch((error) => {
                console.error('Ошибка при отправке фотографии:', error);
                process.exit(1);
            });
    });

program
    .command('help [command]')
    .alias('h')
    .description('display help for command')
    .action(() => {
        program.outputHelp();
        process.exit();
    });

program
    .version(packageJson.version, '-V, --version', 'output the version number')
    .action(() => {
        console.log(packageJson.version);
        process.exit();
    });

program.parse(process.argv);

