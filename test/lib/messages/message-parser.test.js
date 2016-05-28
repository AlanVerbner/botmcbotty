'use strict'

const expect = require('chai').expect

const messageProcessor = require('../../../src/lib/messages/message-parser.js')
const messageTypes = require('../../../src/lib/messages/action-creator').messageTypes

describe('Message Parsing Tests', function () {

    describe('Parse Expense Message', function () {
        it('If contains a valid integer amount returns expense action', () => {
            const facebookMessage = {
                sender: { id: 10154331661253714 },
                recipient: { id: 1781057015462674 },
                timestamp: 1463231154547,
                message:
                {
                    mid: 'mid.1463231154536:e5e9dd1853e88fda47',
                    seq: 66,
                    text: 'I spent $90 in Supermarket'
                }
            }

            const result = messageProcessor(facebookMessage).orSome(undefined)

            expect(result.type).to.equal(messageTypes.NEW_EXPENSE)
            expect(result.amount).to.equal(90)
            expect(result.userId).to.equal(facebookMessage.sender.id)
            expect(result.mid).to.equal('mid.1463231154536:e5e9dd1853e88fda47')

        })

        it('If contains a valid decimal amount returns expense action', () => {
            const facebookMessage = {
                sender: { id: 10154331661253714 },
                recipient: { id: 1781057015462674 },
                timestamp: 1463231154547,
                message:
                {
                    mid: 'mid.1463231154536:e5e9dd1853e88fda47',
                    seq: 66,
                    text: 'I spent $90.23 in Supermarket'
                }
            }

            const result = messageProcessor(facebookMessage).orSome(undefined)

            expect(result.type).to.equal(messageTypes.NEW_EXPENSE)
            expect(result.amount).to.equal(90.23)
            expect(result.userId).to.equal(facebookMessage.sender.id)

        })
        
        it('If contains a valid integer amount but no $ sign, returns expense action', () => {
            const facebookMessage = {
                sender: { id: 10154331661253714 },
                recipient: { id: 1781057015462674 },
                timestamp: 1463231154547,
                message:
                {
                    mid: 'mid.1463231154536:e5e9dd1853e88fda47',
                    seq: 66,
                    text: 'I spent 90 in Supermarket'
                }
            }

            const result = messageProcessor(facebookMessage).orSome(undefined)

            expect(result.type).to.equal(messageTypes.NEW_EXPENSE)
            expect(result.amount).to.equal(90)
            expect(result.userId).to.equal(facebookMessage.sender.id)
            expect(result.mid).to.equal('mid.1463231154536:e5e9dd1853e88fda47')

        })

        it('If contains unknown option it doesn\'t return a message', () => {
            const facebookMessage = {
                sender: { id: 10154331661253714 },
                recipient: { id: 1781057015462674 },
                timestamp: 1463231154547,
                message:
                {
                    mid: 'mid.1463231154536:e5e9dd1853e88fda47',
                    seq: 66,
                    text: 'i stemp $90 in supermarket'
                }
            }

            const result = messageProcessor(facebookMessage).orSome(undefined)
            expect(result.type).not.to.be.defined

        })
    })

    describe('Parse Confirm Action Message', function () {
        it('Parse confirm message', () => {
            const facebookMessage = {
                "sender": {
                    "id": "10154331661253714"
                },
                "recipient": {
                    "id": "1781057015462674"
                },
                "timestamp": 1464445605664,
                "postback": {
                    "payload": "{\"type\":\"CONFIRM_ACTION\",\"mid\":\"mid.1464445596042:a0cd29c35fff51ab76\",\"amount\":20.3,\"category\":\"verduleria\",\"confirm\":true}"
                }
            }

            const result = messageProcessor(facebookMessage).orSome(undefined)
            expect(result.type).to.equal(messageTypes.CONFIRM_ACTION)
            expect(result.confirm).to.be.true
            expect(result.amount).to.equal(20.3)
            expect(result.description).to.equal('verduleria')
            expect(result.mid).to.equal('mid.1464445596042:a0cd29c35fff51ab76_confirm')
        })
        
        it('Parse confirm message', () => {
            const facebookMessage = {
                "sender": {
                    "id": "10154331661253714"
                },
                "recipient": {
                    "id": "1781057015462674"
                },
                "timestamp": 1464445605664,
                "postback": {
                    "payload": "{\"type\":\"CONFIRM_ACTION\",\"mid\":\"mid.1464445596042:a0cd29c35fff51ab76\",\"amount\":20.3,\"category\":\"verduleria\",\"confirm\":false}"
                }
            }

            const result = messageProcessor(facebookMessage).orSome(undefined)
            expect(result.type).to.equal(messageTypes.CONFIRM_ACTION)
            expect(result.confirm).to.be.false
            expect(result.amount).to.equal(20.3)
            expect(result.description).to.equal('verduleria')
            expect(result.mid).to.equal('mid.1464445596042:a0cd29c35fff51ab76_confirm')
        })
    })
})