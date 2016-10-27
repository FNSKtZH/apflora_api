'use strict'

const Joi = require(`joi`)
const queryTabelleDeleteApflora = require(`../../handler/tabelleDeleteApflora.js`)
const queryTabelleInsertApflora = require(`../../handler/tabelleInsertApflora.js`)
const queryTabelleUpdateApflora = require(`../../handler/tabelleUpdateApflora.js`)
const queryTabelleSelectApfloraNumber = require(`../../handler/tabelleSelectApfloraNumber.js`)
const queryTabelleSelectApfloraString = require(`../../handler/tabelleSelectApfloraString.js`)

module.exports = [
  {
    method: `DELETE`,
    path: `/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}`,
    handler: queryTabelleDeleteApflora,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          tabelleIdFeld: Joi.string().required(),
          tabelleId: Joi.number().required(),
        }
      }
    }
  },
  {
    method: `POST`,
    path: `/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}`,
    handler: queryTabelleInsertApflora,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          feld: Joi.string().required(),
          wert: Joi.required(),
          user: Joi.string().required(),
        }
      }
    }
  },
  {
    method: `PUT`,
    path: `/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}`,  // eslint-disable-line max-len
    handler: queryTabelleUpdateApflora,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          tabelleIdFeld: Joi.string().required(),
          tabelleId: Joi.number().required(),
          feld: Joi.string().required(),
          wert: Joi.any(),
          user: Joi.string().required(),
        }
      }
    }
  },
  {
    method: `GET`,
    path: `/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}`,
    handler: queryTabelleSelectApfloraNumber,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          feld: Joi.string().required(),
          wert: Joi.required(),
        }
      }
    }
  },
  {
    method: `GET`,
    path: `/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}`,
    handler: queryTabelleSelectApfloraString,
    config: {
      validate: {
        params: {
          tabelle: Joi.string().required(),
          feld: Joi.string().required(),
          wert: Joi.required(),
        }
      }
    }
  }
]
