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
    // The version with levels leads to error, see:
    // https://github.com/hapijs/hapi/issues/3348
    path: '/node/{table}/{id}/{folder}/{levels}',
    // path: '/node/{table}/{id}/{folder}',
    handler: projekt,
  }
]
