'use strict'

const queryTabelleSelectBeobNumber = require(`../../handler/tabelleSelectBeobNumber.js`)
const queryTabelleSelectBeobString = require(`../../handler/tabelleSelectBeobString.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}`,
    handler: queryTabelleSelectBeobNumber
  },
  {
    method: `GET`,
    path: `/beob/tabelle={tabelle}/feld={feld}/wertString={wert}`,
    handler: queryTabelleSelectBeobString
  }
]
