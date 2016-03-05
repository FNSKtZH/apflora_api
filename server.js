/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
// wird nur in Entwicklung genutzt
// in new Hapi.Server() einsetzen
const serverOptionsDevelopment = {
  debug: {
    log: ['error'],
    request: ['error']
  }
}
const server = new Hapi.Server(serverOptionsDevelopment)
// non-Query routes hat to be separated
// because when testing directory handler produces an error
const routes = require('./src/routes').concat(require('./src/nonQueryRoutes'))

server.connection(require('./dbConnection.js'))

server.register(Inert, (err) => {
  if (err) console.log('failed loading Inert plugin')
  server.register(require('./pgPlugin.js'), (error) => {
    if (error) console.log('failed loading pg plugin')
    // add all the routes
    server.route(routes)
  })
})

module.exports = server
