'use strict'

const queryApliste = require(`../../queries/apliste.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apliste/programm={programm}`,
    handler: queryApliste
  }
]
