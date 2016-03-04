'use strict'

const queryBeobDistzutpopInfospezies = require('../queries/beobDistzutpopInfospezies.js')

module.exports = [
  {
    method: 'GET',
    path: '/beobDistzutpopInfospezies/beobId={beobId}',
    handler: queryBeobDistzutpopInfospezies
  }
]
