/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const Hapi = require(`hapi`)
const Inert = require(`inert`)
const app = require(`ampersand-app`)
const config = require(`./configuration.js`)
const pgp = require(`pg-promise`)()
const dbConnection = require(`./dbConnection.js`)
const felder = require(`./src/handler/felder.js`)
// wird nur in Entwicklung genutzt
// in new Hapi.Server() einsetzen
const serverOptionsDevelopment = { // eslint-disable-line no-unused-vars
  debug: {
    log: [`error`],
    request: [`error`]
  }
}
// TODO: cache für Felder schaffen
// siehe: http://hapijs.com/api#new-serveroptions > cache
const server = new Hapi.Server()

server.connection(dbConnection)

// non-Query routes had to be separated
// because when testing directory handler produces an error
const routes = require(`./src/routes`).concat(require(`./src/nonQueryRoutes`))

server.register(Inert, (err) => {
  if (err) console.log(`failed loading Inert plugin`) // eslint-disable-line no-console

  // add all the routes
  server.route(routes)

  app.extend({
    init() {
      this.db = pgp(config.pgp.connectionString)
    }
  })
  app.init()
})

const second = 1000
const minute = 60 * second
server.method(`felder`, felder, {
  cache: {
    expiresIn: 60 * 12 * minute,
    generateTimeout: 100
  }
})

// make server accessible from handlers
app.extend({
  init() {
    this.server = server
  }
})
app.init()

module.exports = server
