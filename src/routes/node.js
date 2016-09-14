'use strict'

const projekt = require('../../queries/node/projekt.js')

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 */

module.exports = [
  {
    method: 'GET',
    // path: '/node/:table/:id/:folder/:levels',
    path: '/node',
    config: {
      pre: [
        [
          { method: projekt, assign: 'projekt' },
        ]

      ],
      handler (request, reply) {
        console.log('hello')
        reply([
          request.pre.projekt,
        ])
      }
    }
  }
]
