'use strict'

const queryIdealbiotopUebereinst = require(`../../handler/idealbiotopUebereinst.js`)

module.exports = [
  {
    method: `GET`,
    path: `/idealbiotopUebereinst`,
    handler: queryIdealbiotopUebereinst
  }
]
