'use strict'

const aktualisiereArteigenschaften = require(`../../handler/aktualisiereArteigenschaften.js`)

module.exports = [
  {
    method: `GET`,
    path: `/aktualisiereArteigenschaften`,
    handler(request, reply) {
      aktualisiereArteigenschaften(request, reply)
    }
  }
]
