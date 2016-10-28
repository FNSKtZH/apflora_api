'use strict'

const Joi = require(`joi`)
const queryBeobKarte = require(`../handler/beobKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}`,
    handler: queryBeobKarte,
    config: {
      validate: {
        params: {
          apId: Joi.number(),
          tpopId: Joi.number(),
          beobId: Joi.any(),
          nichtZuzuordnen: Joi.any(),
        }
      }
    }
  }
]
