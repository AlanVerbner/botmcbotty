'use strict';

// message-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const message = sequelize.define('messages', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, {
      freezeTableName: true
    });

  message.sync();

  return message;
};
