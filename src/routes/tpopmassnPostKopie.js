'use strict'

const Joi = require(`joi`)
const queryTpopmassnInsertKopie = require(`../handler/tpopmassnInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}`,
    handler: queryTpopmassnInsertKopie,
    config: {
      validate: {
        params: {
          tpopId: Joi.number().required(),
          tpopMassnId: Joi.number().required(),
          user: Joi.string().required(),
        }
      }
    }
  }
]
