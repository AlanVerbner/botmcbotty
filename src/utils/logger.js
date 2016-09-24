'use strict';

const config = require('config');
const bunyan = require('bunyan');

const streams = [{
  level: 'info',
  stream: process.stdout // log INFO and above to stdout
}];

const log = bunyan.createLogger({
  name: 'src',
  level: config.get('logLevel') || 'info',
  streams: streams,
  serializers: bunyan.stdSerializers
});

log.warning = log.warn;

module.exports = log;
