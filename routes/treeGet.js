'use strict'

const treeQualitaetskontrollen = require('../queries/tree/qualitaetskontrollen.js')
const treeAssozarten = require('../queries/tree/assozarten.js')
const treeIdealbiotop = require('../queries/tree/idealbiotop.js')
const treeBeobNichtZuzuordnen = require('../queries/tree/beobNichtZuzuordnen.js')
const treeBeobNichtBeurteilt = require('../queries/tree/beobNichtBeurteilt.js')
const treeBer = require('../queries/tree/ber.js')
const treeJBer = require('../queries/tree/jber.js')
const treeErfkrit = require('../queries/tree/erfkrit.js')
const treeApziel = require('../queries/tree/apziel.js')
const treePop = require('../queries/tree/pop.js')

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 */

module.exports = [
  {
    method: 'GET',
    path: '/tree/apId={apId}',
    config: {
      pre: [
        [
          { method: treeAssozarten, assign: 'assozarten' },
          { method: treeIdealbiotop, assign: 'idealbiotop' },
          { method: treeBeobNichtZuzuordnen, assign: 'beobNichtZuzuordnen' },
          { method: treeBeobNichtBeurteilt, assign: 'beobNichtBeurteilt' },
          { method: treeBer, assign: 'ber' },
          { method: treeJBer, assign: 'jber' },
          { method: treeErfkrit, assign: 'erfkrit' },
          { method: treeApziel, assign: 'apziel' },
          { method: treePop, assign: 'pop' },
          { method: treeQualitaetskontrollen, assign: 'qualitaetskontrollen' }
        ]

      ],
      handler (request, reply) {
        reply([
          request.pre.qualitaetskontrollen,
          request.pre.pop,
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
