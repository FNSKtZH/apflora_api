/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const Hapi = require(`hapi`)
const Inert = require(`inert`)
const InjectThen = require(`inject-then`)
const app = require(`ampersand-app`)
const PGPubsub = require(`pg-pubsub`)
const config = require(`./configuration.js`)
const pgp = require(`pg-promise`)()
const socketIo = require(`socket.io`)
const dbConnection = require(`./dbConnection.js`)
const felder = require(`./src/handler/felder.js`)

const isDev = process.env.NODE_ENV !== `production`
// wird nur in Entwicklung genutzt
// in new Hapi.Server() einsetzen
const serverOptionsDevelopment = {
  // eslint-disable-line no-unused-vars
  debug: {
    log: [`error`],
    request: [`error`],
  },
}
const serverOptionsProduction = {}
const serverOptions = isDev ? serverOptionsDevelopment : serverOptionsProduction
// TODO: cache für Felder schaffen
// siehe: http://hapijs.com/api#new-serveroptions > cache
const server = new Hapi.Server(serverOptions)

server.connection(dbConnection())

// non-Query routes had to be separated
// because when testing directory handler produces an error
const routes = require(`./src/routes`).concat(require(`./src/nonQueryRoutes`))

server.register([Inert, InjectThen], err => {
  if (err) console.log(`failed loading plugins`) // eslint-disable-line no-console

  // add all the routes
  server.route(routes)

  app.extend({
    init() {
      this.db = pgp(config.pgp.connectionString)
    },
  })
  app.init()
})

const second = 1000
const minute = 60 * second
server.method(`felder`, felder, {
  cache: {
    expiresIn: 60 * 12 * minute,
    generateTimeout: 100,
  },
})

// make server accessible from handlers
app.extend({
  init() {
    this.server = server
  },
})
app.init()

// TODO: get to work
// turned off 2017.09.15 because did not work
// and seemed to cause problems
/*
const io = socketIo(server.listener)
const sockets = []
io.on(`connection`, (socket) => {
  sockets.push(socket)
  socket.emit(`connected`, { connected: true })
})
*/

// create pub sub channel
const pubsubInstance = new PGPubsub(config.pgp.connectionString)
pubsubInstance.addChannel(`tabelle_update`, payload => {
  // inform all socket connections of this change
  sockets.forEach(s => s.emit(`tabelle_update`, payload))
})

module.exports = server
