'use strict'

const queryTabelleUpdateMultipleApflora = require(`../../handler/tabelleUpdateMultipleApflora.js`)

module.exports = [
  {
    method: `PUT`,
    path: `/updateMultiple/apflora/tabelle={tabelle}/felder={felder}`,
    handler: queryTabelleUpdateMultipleApflora
  }
]
