'use strict'

const messageTypes = require('./action-creator').messageTypes
const Maybe = require('monet').Maybe


const unknownResponse = Promise.resolve({
    'text': 'Ops! I didn`t understand that message. Sorry'
})

function createExpensePayload(message, confirm) {
    return JSON.stringify({
        "type": messageTypes.CONFIRM_ACTION,
        "mid": message.mid,
        "amount": message.amount,
        "description": message.description,
        "category": message.category,
        "confirm": confirm
    })
}

function createNewExpenseMessageResponse(message) {
    return Promise.resolve({
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": `Have you spent \$${message.amount} in ${message.category}?`,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Yes! I confirm",
                        "payload": createExpensePayload(message, true)
                    }, {
                        "type": "postback",
                        "title": "No",
                        "payload": createExpensePayload(message, false)
                    }
                ]
            }
        }
    })
}

function createNewConfirmActionResponse(message) {
    const confirmMessage = 'Your expense of $' + message.amount + ' in ' + message.description + (message.confirm ? ' was saved! ' : ' wasn\'t saved')
    return {
        text: confirmMessage
    }
}

function processMessage(expensesService, message) {
    switch (message.type) {
        case messageTypes.UNKNOWN:
            return unknownResponse
        case messageTypes.NEW_EXPENSE:
            return createNewExpenseMessageResponse(message)
        case messageTypes.CONFIRM_ACTION:
            return expensesService.create({
                amount: message.amount,
                category: message.category,
                description: expense.description
            }).then(() => {
                return createNewConfirmActionResponse(message)
            })
        default:
            return unknownResponse
    }
}


module.exports = function getNextState(expensesService, message) {
    return message.map(m => { return processMessage(expensesService, m) })
}