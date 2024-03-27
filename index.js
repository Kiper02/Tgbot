const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require ('./options.js')

const token = '6774260081:AAEfZuk7519WQtZ7O5A8m0JtNOpeemY-F9w'

const bot = new TelegramApi(token, {polling: true})


const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, а ты угадай')
    const randNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие '},
        {command: '/info', description: 'Получить информ'},
        {command: '/game', description: 'игра'}
    ])
    
    bot.on('message', async (msg) => {
        const text = msg.text 
        const chatId = msg.chat.id
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, 'Добро пожаловать')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'не знаю таких команд')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame (chatId)
        }
        if (data === chatId[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожелению ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }

    })
}

start()