'use strict'

const queryIdealbiotopUebereinst = require('../queries/idealbiotopUebereinst.js')

module.exports = [
  {
    method: 'GET',
    path: '/idealbiotopUebereinst',
    handler: queryIdealbiotopUebereinst
  }
]
