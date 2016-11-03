/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const server = require(`./server.js`)

server.start((err) => {
  if (err) throw err
  console.log(`Server running at:`, server.info.uri)  // eslint-disable-line no-console
})
