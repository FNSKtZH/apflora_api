'use strict'

const queryBeobDistzutpopEvab = require(`../../handler/beobDistzutpopEvab.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobDistzutpopEvab/beobId={beobId}`,
    handler: queryBeobDistzutpopEvab
  }
]
