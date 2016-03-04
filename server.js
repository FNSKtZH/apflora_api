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
const routes = require('./routes')

server.register(Inert, (err) => {
  if (err) console.log('failed loading Inert plugin')
  server.connection(require('./dbConnection.js'))
  // add all the routes
  server.route(routes)
})

server.start((err) => {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
})

module.exports = server
