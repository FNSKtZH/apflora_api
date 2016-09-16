'use strict'

const queryTabelleUpdateMultipleApflora = require(`../../queries/tabelleUpdateMultipleApflora.js`)

module.exports = [
  {
    method: `PUT`,
    path: `/updateMultiple/apflora/tabelle={tabelle}/felder={felder}`,
    handler: queryTabelleUpdateMultipleApflora
  }
]
