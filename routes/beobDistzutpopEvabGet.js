'use strict'

const queryBeobDistzutpopEvab = require('../queries/beobDistzutpopEvab.js')

module.exports = {
  method: 'GET',
  path: '/beobDistzutpopEvab/beobId={beobId}',
  handler: queryBeobDistzutpopEvab
}
