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
          beobId: Joi.alternatives().try(
            Joi.number().min(-2147483648).max(+2147483647),
            Joi.string().guid()
          ),
          nichtZuzuordnen: Joi.any(),
        }
      }
    }
  }
]
