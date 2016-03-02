'use strict'

const queryArtliste = require('../queries/artliste.js')

module.exports = {
  method: 'GET',
  path: '/artliste',
  handler: queryArtliste
}
