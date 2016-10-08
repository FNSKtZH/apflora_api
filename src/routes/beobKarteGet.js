'use strict'

const queryBeobKarte = require(`../../handler/beobKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}`,
    handler: queryBeobKarte
  }
]
