'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const expense = sequelize.define('expenses', {
    category: {
      type: Sequelize.STRING,
      allowNull: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  module.exports.Expense = expense;

  return expense;
};
