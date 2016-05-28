'use strict'

const keyMirror = require('key-mirror')

const messageTypes = keyMirror({
    UNKNOWN: null,
    NEW_EXPENSE: null,
    CONFIRM_ACTION: null
})

function createNewUnknownMessage(mid, amount, category) {
    return {
        type: messageTypes.UNKNOWN,
        mid
    }
}

function createNewExpenseAction(mid, amount, category) {
    return {
        type: messageTypes.NEW_EXPENSE,
        mid,
        amount,
        category
    }
}

function createNewConfirmAction(mid, confirm, amount, category) {
    return {
        type: messageTypes.CONFIRM_ACTION,
        confirm,
        mid: mid + "_confirm",
        amount,
        category
    }
}

module.exports = {
    createNewUnknownMessage,
    createNewExpenseAction,
    createNewConfirmAction,
    messageTypes
}