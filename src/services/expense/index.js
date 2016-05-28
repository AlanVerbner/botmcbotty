'use strict';

const service = require('feathers-sequelize');
const expense = require('./expense-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: expense(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/expenses', service(options));

  // Get our initialize service to that we can bind hooks
  const expenseService = app.service('/expenses');

  // Set up our before hooks
  expenseService.before(hooks.before);

  // Set up our after hooks
  expenseService.after(hooks.after);
};
