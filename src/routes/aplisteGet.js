'use strict'

const queryApliste = require(`../../handler/apliste.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apliste/programm={programm}`,
    handler: queryApliste
  }
]
