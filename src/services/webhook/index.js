'use strict';

const hooks = require('./hooks')
const _ = require('lodash')
const messageParser = require(__baseDir + 'lib/messages/message-parser')
const stateMachine = require(__baseDir + 'lib/messages/response-state-machine')
const superagent = require(__baseDir + 'lib/util/superagent-promisified')
const co = require('co')

function sendResponseToFacebook(to, message) {
  return superagent('POST', 'https://graph.facebook.com/v2.6/me/messages')
    .query({ access_token: TOKEN })
    .send({
      'recipient': {
        'id': to
      },
      'message': message
    })
    .end()
}

function processMessage(logger, messagesService, expensesService, msg) {
  return co(function* () {
    logger.info('new Message arrived', JSON.stringify(msg))
    const parsed = messageParser(msg)
    logger.info('Parsed', JSON.stringify(parsed.some()))
    const messageId = parsed.some().mid
    const to = msg.sender.id
    try {
      const storedMessage = yield messagesService.get(messageId)
      logger.warn('Message already received', messageId)
      return Promise.resolve({ txt: 'message already received' })
    } catch (err) {
      logger.info('Processing new message', JSON.stringify(msg))
      const responseMsg = yield stateMachine(expensesService, parsed).some()
      try {
        logger.info('Sending to %s response %s', to, JSON.stringify(responseMsg))
        yield sendResponseToFacebook(to, responseMsg)
        logger.info('Response to %s sent', to)
        logger.info('Saving message %s into db', messageId)
        yield messagesService.create({ id: messageId })
        logger.info('Message %s saved', messageId)
        return Promise.resolve({ handled: true })
      } catch (err) {
        logger.error('Error sending response', err, JSON.stringify(err))
        //throw err
      }
    }
  })
}

class Service {
  constructor(fbToken, messagesService, expensesService, logger) {
    this.fbToken = fbToken
    this.messagesService = messagesService
    this.expensesService = expensesService
    this.logger = logger
  }

  find(params) {
    if (params.query['hub.verify_token'] === fbToken) {
      return Promise.resolve(parseInt(params.query['hub.challenge']))
    }
    return Promise.reject('Error, wrong validation token')
  }

  create(data, params) {
    this.logger.info('Raw message arrived', JSON.stringify(data), JSON.stringify(params))
    return co(function* () {
      for (let entry of data.entry) {
        for (let msg of entry.messaging) {
          yield processMessage(this.logger, this.messagesService, this.expensesService, msg)
        }
      }
      return Promise.resolve(true)
    }.bind(this))
  }

}

module.exports = function () {
  const app = this
  // Initialize our service with any options it requires
  app.use('/webhooks', new Service(app.get('fbToken'), app.service('messages'), app.service('expenses'), app.get('logger')))

  // Get our initialize service to that we can bind hooks
  const webhookService = app.service('/webhooks')

  // Set up our before hooks
  webhookService.before(hooks.before)

  // Set up our after hooks
  webhookService.after(hooks.after)
}

module.exports.Service = Service
