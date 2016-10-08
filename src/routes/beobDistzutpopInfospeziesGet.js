'use strict'

const queryBeobDistzutpopInfospezies = require(`../../handler/beobDistzutpopInfospezies.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobDistzutpopInfospezies/beobId={beobId}`,
    handler: queryBeobDistzutpopInfospezies
  }
]
