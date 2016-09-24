'use strict';

const config = require('config');
const restify = require('restify');
const db = require('./db/db');
const logger = require('./utils/logger');
const routes = require('./routes');

const configureServer = function(server) {
  server.use(restify.bodyParser());
  server.use(restify.queryParser());
  server.use(restify.requestLogger());
  server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
  });
};

db.sync().then(() => {
  const server = restify.createServer({
    log: logger
  });
  logger.info('Configuring server');
  configureServer(server);
  logger.info('Creating routes');
  routes(server);
  server.listen(config.get('port'), function() {
    logger.info('%s listening at %s', server.name, server.url);
  });
}).catch(err => {
  logger.error(err);
});
