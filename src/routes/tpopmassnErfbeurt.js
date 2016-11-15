'use strict'

const tpopmassnErfbeurtGet = require(`../handler/tpopmassnErfbeurtGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopmassnErfbeurt`,
    handler: tpopmassnErfbeurtGet,
  }
]
