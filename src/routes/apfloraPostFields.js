'use strict'

const Joi = require(`joi`)
const queryTabelleInsertFieldsApflora = require(`../handler/tabelleInsertFieldsApflora.js`)

module.exports = [
  {
    method: `POST`,
    path: `/insertFields/apflora/tabelle={tabelle}`,
    handler: queryTabelleInsertFieldsApflora,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
        },
      },
    },
  },
]
