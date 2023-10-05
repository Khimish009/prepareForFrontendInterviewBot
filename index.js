require('dotenv').config()
const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require('grammy')

const bot = new Bot(process.env.BOT_API_KEY)

bot.command('start', async (ctx) => {
    const keyboard = new Keyboard()
        .text('HTML').text('CSS').row()
        .text('JavaScript').text('React').resized()

    await ctx.reply('Привет!. Я помогу тебе подготовиться к собесу!!!')
    await ctx.reply('С какой темы начнём? Выбери тему внизу 👇', {
        reply_markup: keyboard
    })
})

bot.hears(['HTML', 'CSS', 'JavaScript', 'React'], async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
        .text('Получить ответ', 'getAnswer')
        .text('Отмена', 'cancel')

    await ctx.reply(`Что такое ${ctx.message.text}`, {
        reply_markup: inlineKeyboard
    })
})

bot.catch((err) => {
    const ctx = err.ctx
    console.error(`Error while handling update ${ctx.update.update_id}:`)
    const e = err.error
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description)
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e)
    } else {
        console.error("Unknown error:", e)
    }
})

bot.start()
