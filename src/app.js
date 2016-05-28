'use strict'

const path = require('path')
const serveStatic = require('feathers').static
const favicon = require('serve-favicon')
const compress = require('compression')
const cors = require('cors')
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const hooks = require('feathers-hooks')
const rest = require('feathers-rest')
const bodyParser = require('body-parser')
const logger = require('feathers-logger')
const socketio = require('feathers-socketio');

const middleware = require('./middleware')
const services = require('./services')

const winston = require('winston')
const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    })
  ],
  exitOnError: false
});

const app = feathers()

app.configure(configuration(path.join(__dirname, '..')))

function configureSequelize() {
  const Sequelize = require('sequelize')
  const sequelizeConfig = app.get('sequelize')
  const sequelize = new Sequelize(process.env.DATABASE_URL || app.get('sequelize'))
  app.set('sequelize', sequelize)
}

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon(path.join(app.get('public'), 'favicon.ico')))
  .use('/', serveStatic(app.get('public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(logger(winstonLogger))
  .configure(configureSequelize)
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware)

module.exports = app
