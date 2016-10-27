'use strict'

const Joi = require(`joi`)
const queryBeobDistzutpopInfospezies = require(`../../handler/beobDistzutpopInfospezies.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobDistzutpopInfospezies/beobId={beobId}`,
    handler: queryBeobDistzutpopInfospezies,
    config: {
      validate: {
        params: {
          beobId: Joi.number().required(),
        }
      }
    }
  }
]
