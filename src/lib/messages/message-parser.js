'use strict'

const actionCreator = require('./action-creator')
const Maybe = require('monet').Maybe

const categoryDetector = require('./category-detector')

function processTextMessage(payload) {

    const matches = payload.text.toLowerCase().match(/i spent \$?(\d+\.?\d*|\.\d+) in ([A-Za-z]+)/)
    if (matches && matches.length == 3) {
        const category = categoryDetector(matches[2])

        return actionCreator.createNewExpenseAction(
            payload.mid,
            parseFloat(matches[1]),
            category,
            matches[2])
    }

    return actionCreator.createNewUnknownMessage(payload.mid)
}

function processPostback(payload) {
    return actionCreator.createNewConfirmAction(payload.mid, payload.confirm, payload.amount, payload.category)
}

const addFbData = function (fbMessage, procesedMessage) {
    return Object.assign({},
        procesedMessage, {
            userId: fbMessage.sender.id,
        })
}.curry()

function processFacebookMessage(fbMessage) {
    // undefined == null :)
    const maybeMessage = Maybe.fromNull(fbMessage.message)
        .map(message => {
            return processTextMessage({
                mid: message.mid,
                text: message.text
            })
        })

    const maybePayload = Maybe.fromNull(fbMessage.postback)
        .map(postback => {
            return processPostback(JSON.parse(postback.payload))
        })

    return maybeMessage.orElse(maybePayload).map(addFbData(fbMessage))
}

module.exports = processFacebookMessage
