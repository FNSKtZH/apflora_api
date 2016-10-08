'use strict'

const queryAnmeldung = require(`../../handler/anmeldung.js`)

module.exports = [
  {
    method: `GET`,
    path: `/anmeldung/name={name}/pwd={pwd}`,
    handler: queryAnmeldung
  }
]
