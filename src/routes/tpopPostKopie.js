'use strict'

const Joi = require(`joi`)
const queryTpopInsertKopie = require(`../handler/tpopInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/tpopInsertKopie/popId={popId}/tpopId={tpopId}/user={user}`,
    handler: queryTpopInsertKopie,
    config: {
      validate: {
        params: {
          popId: Joi.number().required(),
          tpopId: Joi.number().required(),
          user: Joi.string().required(),
        }
      }
    }
  }
]
