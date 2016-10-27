'use strict'

const Joi = require(`joi`)
const queryFeldkontrInsert = require(`../../handler/feldkontrInsert.js`)

module.exports = [
  {
    method: `POST`,
    path: `/insert/feldkontr/tpopId={tpopId}/tpopKontrtyp={tpopKontrtyp?}/user={user}`,
    handler: queryFeldkontrInsert,
    config: {
      validate: {
        params: {
          tpopId: Joi.number().required(),
          tpopKontrtyp: Joi.any(),
          user: Joi.string().required(),
        }
      }
    }
  }
]
