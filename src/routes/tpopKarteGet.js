'use strict'

const Joi = require(`joi`)
const queryTPopKarte = require(`../../handler/tpopKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKarte/tpopId={tpopId}`,
    handler: queryTPopKarte,
    config: {
      validate: {
        params: {
          tpopId: Joi.number().required(),
        }
      }
    }
  }
]
