/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

const server = require(`./server.js`)
const PGPubsub = require(`pg-pubsub`)
const config = require(`./configuration.js`)

server.start((err) => {
  if (err) throw err
  // create pub sub channel
  const pubsubInstance = new PGPubsub(config.pgp.connectionString)
  pubsubInstance.addChannel(`tabelle_update`, (payload) => {
    console.log(payload)
  })
  console.log(`Server running at:`, server.info.uri)  // eslint-disable-line no-console
})
