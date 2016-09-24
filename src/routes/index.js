'use strict';

const config = require('config');
const co = require('co');
const messageParser = require('../lib/messages/message-parser');
const stateMachine = require('../lib/messages/response-state-machine.js');
const logger = require('../utils/logger');
const Message = require('../db/models/message-model').Message;
const Expense = require('../db/models/expense-model').Expense;

const fbToken = process.env.FB_TOKEN || config.get('auth.token.secret');

const sendResponseToFacebook = function sendResponseToFacebook(token, to, message) {
  return superagent('POST', 'https://graph.facebook.com/v2.6/me/messages')
    .query({
      access_token: token
    })
    .send({
      recipient: {
        id: to
      },
      message: message
    })
    .end();
};

const processMessage = function processMessage(logger, token, Message, Expense, msg) {
  return co(function*() {
    logger.info('new Message arrived', JSON.stringify(msg));
    const parsed = messageParser(msg);
    logger.info('Parsed', JSON.stringify(parsed.some()));
    const messageId = parsed.some().mid;
    const to = msg.sender.id;
    try {
      logger.warn('Message already received', messageId);
      return Promise.resolve({
        txt: 'message already received'
      });
    } catch (err) {
      logger.info('Processing new message', JSON.stringify(msg));
      const responseMsg = yield stateMachine(Expense, parsed).some();
      try {
        logger.info('Sending to %s response %s', to, JSON.stringify(responseMsg));
        yield sendResponseToFacebook(token, to, responseMsg);
        logger.info('Response to %s sent', to);
        logger.info('Saving message %s into db', messageId);
        yield Message.create({
          id: messageId
        });
        logger.info('Message %s saved', messageId);
        return Promise.resolve({
          handled: true
        });
      } catch (err) {
        logger.error('Error sending response', err, JSON.stringify(err));
      }
    }
  });
};

module.exports = server => {
  server.get('/messages', (req, res, next) => {
    if (req.query && req.query.hub.verify_token === fbToken) {
      res.write(req.query.hub.challenge);
      res.end();
    }
    return res.send(400, new Error('Error, wrong validation token'));
  });

  server.post('/messages', (req, res, next) => {
    logger.info('Raw message arrived', JSON.stringify(req.body), JSON.stringify(req.params));
    return co(function*() {
      for (let entry of req.body.entry) {
        for (let msg of entry.messaging) {
          yield processMessage(logger, fbToken, Message, Expense, msg);
        }
      }
      return Promise.resolve(true);
    });
  });
};
