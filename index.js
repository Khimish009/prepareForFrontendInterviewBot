require('dotenv').config()
const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require('grammy')
const { getRandomQuestion, getCorrectAnswer } = require('./utils')

const bot = new Bot(process.env.BOT_API_KEY)

bot.command('start', async (ctx) => {
    const keyboard = new Keyboard()
        .text('HTML').text('CSS').row()
        .text('JavaScript').text('React').resized()

    await ctx.reply('Привет! Я помогу тебе подготовиться к собесу!!!')
    await ctx.reply('С какой темы начнём? Выбери тему внизу 👇', {
        reply_markup: keyboard
    })
})

bot.hears(['HTML', 'CSS', 'JavaScript', 'React'], async (ctx) => {
    const topic = ctx.message.text.toLowerCase()
    const question = getRandomQuestion(topic)
    let inlineKeyboard

    if (question.hasOptions) {
        const buttonRows = question.options.map(option => [
            InlineKeyboard.text(
                option.text,
                JSON.stringify({
                    type: `${topic}-option`,
                    isCorrect: option.isCorrect,
                    questionId: question.id,
                })
            )
        ])

        inlineKeyboard = InlineKeyboard.from(buttonRows)
    } else {
        inlineKeyboard = new InlineKeyboard()
            .text('Узнать ответ', JSON.stringify({
                type: topic,
                questionId: question.id,
            }))
    }

    await ctx.reply(question.text, {
        reply_markup: inlineKeyboard
    })
})

bot.on('callback_query:data', async (ctx) => {
    const { type, questionId, isCorrect } = JSON.parse(ctx.callbackQuery.data)
    const topic = type.includes('option') ? type.replace(/-option/, '') : type
    const answer = getCorrectAnswer(topic, questionId)

    if (!type.includes('option')) {
        await ctx.reply(answer, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        })
        await ctx.answerCallbackQuery()
        return
    }

    if (isCorrect) {
        await ctx.reply('Верно ✅')
        await ctx.answerCallbackQuery()
        return
    }

    await ctx.reply(`Неверно ❌. Правильный ответ: ${answer}`)
    await ctx.answerCallbackQuery()
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
