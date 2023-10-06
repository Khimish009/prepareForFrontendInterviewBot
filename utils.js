const questions = require('./questions.json')

const getRandomQuestion = (topic) => {
    const questionTopic = topic
    const randomQuestionIndex = Math.floor(Math.random() * questions[questionTopic].length)

    return questions[questionTopic][randomQuestionIndex]
}

const getCorrectAnswer = (topic, questionId) => {
    const question = questions[topic].find(({ id }) => id === questionId)

    if (question.hasOptions) {
        return question.options.find(({ isCorrect }) => isCorrect).text
    } else {
        return question.answer
    }
}

module.exports = {
    getRandomQuestion,
    getCorrectAnswer
}
