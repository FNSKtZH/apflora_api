'use strict'

module.exports = [
  {
    method: 'GET',
    path: '/{path*}',
    handler (request, reply) {
      reply.file('index.html')
    }
  }
]
