'use strict'

const queryArtliste = require(`../handler/artliste.js`)

module.exports = [
  {
    method: `GET`,
    path: `/artliste`,
    handler: queryArtliste
  }
]
