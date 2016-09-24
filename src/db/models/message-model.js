'use strict';

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const message = sequelize.define('messages', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  module.exports.Message = message;

  return message;
};
