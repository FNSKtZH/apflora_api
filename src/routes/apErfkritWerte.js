'use strict'

const apErfkritWerteGet = require(`../handler/apErfkritWerteGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apErfkritWerte`,
    handler: apErfkritWerteGet,
  }
]
