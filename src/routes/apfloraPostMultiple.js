'use strict'

const queryTabelleInsertMultipleApflora = require(`../../handler/tabelleInsertMultipleApflora.js`)

module.exports = [
  {
    method: `POST`,
    path: `/insertMultiple/apflora/tabelle={tabelle}/felder={felder}`,
    handler: queryTabelleInsertMultipleApflora
  }
]
