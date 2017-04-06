'use strict'

const Joi = require(`joi`)
const queryTabelleInsertFieldsApflora = require(`../handler/tabelleInsertFieldsApflora.js`)

module.exports = [
  {
    method: `POST`,
    path: `/insertFields/apflora/tabelle={tabelle}/felder={felder}`,
    handler: queryTabelleInsertFieldsApflora,
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
