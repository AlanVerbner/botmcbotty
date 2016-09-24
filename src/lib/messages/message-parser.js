'use strict';

const Logger = require('node-wit').Logger;
const levels = require('node-wit').logLevels;
const Wit = require('node-wit').Wit;

const logger = new Logger(levels.ERROR);

const actions = {
  say(sessionId, context, message, cb) {
    cb();
  },
  merge(sessionId, context, entities, message, cb) {
    if (context && entities) {
      context.action = entities.action ? entities.action[0].value : context.action;
      context.amount_of_money = entities.amount_of_money ? entities.amount_of_money[0].value : context.amount_of_money;
      context.expenseType = entities.expenseType ? entities.expenseType[0].value : context.expenseType;
      context.yes_no = entities.yes_no && entities.yes_no[0].value === "Yes" ? "Yes" : undefined;
    }
    cb(context);
  },
  error(sessionId, context, err) {},
  saveExpense(sessionId, context, callback) {
    delete context.yes_no;
    callback(context);
  },
  cancelExpense(sessionId, context, callback) {
    callback({});
  }
};

const client = new Wit(process.env.WIT_TOKEN, actions, logger);

module.exports = function processFacebookMessage(fbId, userContext, message) {
  return new Promise((resolve, fail) => {
    client.runActions(fbId, message, userContext, (error, newContext) => {
      resolve(newContext);
    });
  });
};
