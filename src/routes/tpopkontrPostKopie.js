'use strict'

const Joi = require(`joi`)
const queryTpopkontrInsertKopie = require(`../handler/tpopkontrInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/tpopkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}`,
    handler: queryTpopkontrInsertKopie,
    config: {
      validate: {
        params: {
          tpopId: Joi.number().required(),
          tpopKontrId: Joi.number().required(),
          user: Joi.string().required(),
        }
      }
    }
  }
]
