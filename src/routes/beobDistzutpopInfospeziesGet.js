'use strict'

const Joi = require(`joi`)
const queryBeobDistzutpopInfospezies = require(`../handler/beobDistzutpopInfospezies.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobDistzutpopInfospezies/beobId={beobId}`,
    handler: queryBeobDistzutpopInfospezies,
    config: {
      validate: {
        params: {
          beobId: Joi.alternatives().try(
            Joi.number().min(-2147483648).max(+2147483647),
            Joi.string().guid()
          ).required(),
        }
      }
    }
  }
]
