'use strict'

const queryTabelleDeleteApflora = require(`../../queries/tabelleDeleteApflora.js`)
const queryTabelleInsertApflora = require(`../../queries/tabelleInsertApflora.js`)
const queryTabelleUpdateApflora = require(`../../queries/tabelleUpdateApflora.js`)
const queryTabelleSelectApfloraNumber = require(`../../queries/tabelleSelectApfloraNumber.js`)
const queryTabelleSelectApfloraString = require(`../../queries/tabelleSelectApfloraString.js`)

module.exports = [
  {
    method: `DELETE`,
    path: `/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}`,
    handler: queryTabelleDeleteApflora
  },
  {
    method: `POST`,
    path: `/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}`,
    handler: queryTabelleInsertApflora
  },
  {
    method: `PUT`,
    path: `/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}`,  // eslint-disable-line max-len
    handler: queryTabelleUpdateApflora
  },
  {
    method: `GET`,
    path: `/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}`,
    handler: queryTabelleSelectApfloraNumber
  },
  {
    method: `GET`,
    path: `/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}`,
    handler: queryTabelleSelectApfloraString
  }
]
