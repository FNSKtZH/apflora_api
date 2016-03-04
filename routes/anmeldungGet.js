'use strict'

const queryAnmeldung = require('../queries/anmeldung.js')

module.exports = [
  {
    method: 'GET',
    path: '/anmeldung/name={name}/pwd={pwd}',
    handler: queryAnmeldung
  }
]
