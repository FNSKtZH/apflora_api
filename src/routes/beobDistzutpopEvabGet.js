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
          beobId: Joi.string().required(),
        }
      }
    }
  }
]
