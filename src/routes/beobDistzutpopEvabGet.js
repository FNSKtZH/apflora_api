'use strict'

const Joi = require(`joi`)
const queryBeobDistzutpopEvab = require(`../handler/beobDistzutpopEvab.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobDistzutpopEvab/beobId={beobId}`,
    handler: queryBeobDistzutpopEvab,
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
