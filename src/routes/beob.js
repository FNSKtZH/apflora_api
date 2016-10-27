'use strict'

const Joi = require(`joi`)
const queryTabelleSelectBeobNumber = require(`../../handler/tabelleSelectBeobNumber.js`)
const queryTabelleSelectBeobString = require(`../../handler/tabelleSelectBeobString.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}`,
    handler: queryTabelleSelectBeobNumber,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          feld: Joi.string().required(),
          wert: Joi.number().required(),
        }
      }
    }
  },
  {
    method: `GET`,
    path: `/beob/tabelle={tabelle}/feld={feld}/wertString={wert}`,
    handler: queryTabelleSelectBeobString,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          feld: Joi.string().required(),
          wert: Joi.string().required(),
        }
      }
    }
  }
]
