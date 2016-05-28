'use strict';

// expense-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
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

  expense.sync();

  return expense;
};
