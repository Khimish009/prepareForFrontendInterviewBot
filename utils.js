const questions = require('./questions.json')

const getRandomQuestion = (topic) => {
    let questionTopic = topic

    if (questionTopic === 'случайный вопрос') {
        const questionKeys = Object.keys(questions)
        questionTopic = questionKeys[Math.floor(Math.random() * (questionKeys.length - 1))]
    }

    const randomQuestionIndex = Math.floor(Math.random() * questions[questionTopic].length)

    return {
        question: questions[questionTopic][randomQuestionIndex],
        questionTopic
    }
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
