'use strict'

const qualitaetskontrollen = require('../../queries/node/qualitaetskontrollen.js')
const assozarten = require('../../queries/node/assozarten.js')
const idealbiotop = require('../../queries/node/idealbiotop.js')
const beobNichtZuzuordnen = require('../../queries/node/beobNichtZuzuordnen.js')
const beobNichtBeurteilt = require('../../queries/node/beobNichtBeurteilt.js')
const ber = require('../../queries/node/ber.js')
const jBer = require('../../queries/node/jber.js')
const erfkrit = require('../../queries/node/erfkrit.js')
const apziel = require('../../queries/node/apziel.js')
const pop = require('../../queries/node/pop.js')
const ap = require('../../queries/node/ap.js')
const projekt = require('../../queries/node/projekt.js')

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 */

module.exports = [
  {
    method: 'GET',
    path: '/node/:table/:id/:folder/:levels',
    config: {
      pre: [
        [
          { method: assozarten, assign: 'assozarten' },
          { method: idealbiotop, assign: 'idealbiotop' },
          { method: beobNichtZuzuordnen, assign: 'beobNichtZuzuordnen' },
          { method: beobNichtBeurteilt, assign: 'beobNichtBeurteilt' },
          { method: ber, assign: 'ber' },
          { method: jBer, assign: 'jber' },
          { method: erfkrit, assign: 'erfkrit' },
          { method: apziel, assign: 'apziel' },
          { method: pop, assign: 'pop' },
          { method: ap, assign: 'ap' },
          { method: projekt, assign: 'projekt' },
          { method: qualitaetskontrollen, assign: 'qualitaetskontrollen' }
        ]

      ],
      handler (request, reply) {
        reply([
          request.pre.qualitaetskontrollen,
          request.pre.pop,
          request.pre.ap,
          request.pre.projekt,
          request.pre.apziel,
          request.pre.erfkrit,
          request.pre.jber,
          request.pre.ber,
          request.pre.beobNichtBeurteilt,
          request.pre.beobNichtZuzuordnen,
          request.pre.idealbiotop,
          request.pre.assozarten
        ])
      }
    }
  }
]
