const faker = require('faker');
const expect = require('chai').expect;

const processFacebookMessage = require('../../../src/lib/messages/message-parser');

module.exports = function() {

  const doProcessMessage = function(message) {
    return processFacebookMessage(this.fbId, this.userContext, message)
      .then(newContext => this.userContext = newContext);
  }

  this.Given(/I'm a random facebook user/, function() {
    this.fbId = faker.random.uuid();
    this.userContext = {};
  });

  this.When('I send the message $message', function(message) {
    return doProcessMessage.bind(this)(message);
  });

  this.When(/Confirm my expense/, function() {
    return doProcessMessage.bind(this)("Yes");
  });

  this.When(/Cancel my expense/, function() {
    return doProcessMessage.bind(this)("No");
  });

  this.Then(/^It should create a new Expense with type (.+) and amount of (\d+)$/, function(expenseType, amount) {
    expect(this.userContext.expenseType).to.equal(expenseType);
    expect(this.userContext.amount_of_money).to.equal(parseInt(amount));
  });

  this.Then(/^It should not create a new Expense$/, function() {
    expect(this.userContext.expenseType).to.be.undefined
    expect(this.userContext.amount_of_money).to.be.undefined
  });

}