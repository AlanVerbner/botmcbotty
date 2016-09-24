'use strict';

const config = require('config');
const Sequelize = require('sequelize');
const logger = require('../utils/logger');

const db = new Sequelize(process.env.DATABASE_URL || config.get('sequelize'));

const normalizedPath = require('path').join(__dirname, './models/');
logger.debug(`Loading models from ${normalizedPath}`);
require('fs').readdirSync(normalizedPath).forEach(function(file) {
  require(normalizedPath + file)(db, Sequelize);
});
logger.debug('Models loaded!');

module.exports.sync = function() {
  return Promise.all([
    require('./models/expense-model').Expense.sync(),
    require('./models/message-model').Message.sync()
  ]);
};
