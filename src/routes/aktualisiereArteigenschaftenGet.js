'use strict'

const aktualisiereArteigenschaften = require('../../queries/aktualisiereArteigenschaften.js')

module.exports = [
  {
    method: 'GET',
    path: '/aktualisiereArteigenschaften',
    handler(request, reply) {
      aktualisiereArteigenschaften(request, reply)
    }
  }
]
