'use strict'

const Joi = require(`joi`)
const queryTabelleInsertMultipleApflora = require(`../handler/tabelleInsertMultipleApflora.js`)

module.exports = [
  {
    method: `POST`,
    path: `/insertMultiple/apflora/tabelle={tabelle}/felder={felder}`,
    handler: queryTabelleInsertMultipleApflora,
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
