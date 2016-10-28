'use strict'

const Joi = require(`joi`)
const treeQualitaetskontrollen = require(`../handler/tree/qualitaetskontrollen.js`)
const treeAssozarten = require(`../handler/tree/assozarten.js`)
const treeIdealbiotop = require(`../handler/tree/idealbiotop.js`)
const treeBeobNichtZuzuordnen = require(`../handler/tree/beobNichtZuzuordnen.js`)
const treeBeobNichtBeurteilt = require(`../handler/tree/beobNichtBeurteilt.js`)
const treeBer = require(`../handler/tree/ber.js`)
const treeJBer = require(`../handler/tree/jber.js`)
const treeErfkrit = require(`../handler/tree/erfkrit.js`)
const treeApziel = require(`../handler/tree/apziel.js`)
const treePop = require(`../handler/tree/pop.js`)

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 */

module.exports = [
  {
    method: `GET`,
    path: `/tree/apId={apId}`,
    config: {
      pre: [
        [
          { method: treeAssozarten, assign: `assozarten` },
          { method: treeIdealbiotop, assign: `idealbiotop` },
          { method: treeBeobNichtZuzuordnen, assign: `beobNichtZuzuordnen` },
          { method: treeBeobNichtBeurteilt, assign: `beobNichtBeurteilt` },
          { method: treeBer, assign: `ber` },
          { method: treeJBer, assign: `jber` },
          { method: treeErfkrit, assign: `erfkrit` },
          { method: treeApziel, assign: `apziel` },
          { method: treePop, assign: `pop` },
          { method: treeQualitaetskontrollen, assign: `qualitaetskontrollen` }
        ]

      ],
      handler(request, reply) {
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
      },
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
