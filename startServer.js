/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const server = require(`./server.js`)
const app = require(`ampersand-app`)

server.start((err) => {
  if (err) throw err
  // make server accessible from handlers
  app.extend({
    init() {
      this.server = server
    }
  })
  app.init()
  console.log(`Server running at:`, server.info.uri)  // eslint-disable-line no-console
})
