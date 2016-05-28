'use strict'
const expense = require('./expense');
const message = require('./message')
const webhook = require('./webhook')
const authentication = require('./authentication')

module.exports = function () {
  const app = this

  app.configure(authentication)
  app.configure(expense)
  app.configure(message)
  app.configure(webhook)

}
