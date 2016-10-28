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
// wird nur in Entwicklung genutzt
// in new Hapi.Server() einsetzen
const serverOptionsDevelopment = {
  debug: {
    log: [`error`],
    request: [`error`]
  }
}
const server = new Hapi.Server(serverOptionsDevelopment)

server.connection(dbConnection)

// non-Query routes had to be separated
// because when testing directory handler produces an error
const routes = require(`./src/routes`).concat(require(`./src/nonQueryRoutes`))

server.register(Inert, (err) => {
  if (err) console.log(`failed loading Inert plugin`)

  // add all the routes
  server.route(routes)

  app.extend({
    init() {
      this.db = pgp(config.pgp.connectionString)
    }
  })
  app.init()
})

module.exports = server
