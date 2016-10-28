'use strict'

const Joi = require(`joi`)
const queryTabelleUpdateMultipleApflora = require(`../handler/tabelleUpdateMultipleApflora.js`)

module.exports = [
  {
    method: `PUT`,
    path: `/updateMultiple/apflora/tabelle={tabelle}/felder={felder}`,
    handler: queryTabelleUpdateMultipleApflora,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          felder: Joi.any().required(),
        }
      }
    }
  }
]
