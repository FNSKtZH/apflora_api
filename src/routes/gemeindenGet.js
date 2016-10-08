'use strict'

const queryGemeinden = require(`../../handler/gemeinden.js`)

module.exports = [
  {
    method: `GET`,
    path: `/gemeinden`,
    handler: queryGemeinden
  }
]
