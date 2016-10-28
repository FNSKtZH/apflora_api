'use strict'

const Joi = require(`joi`)
const queryApliste = require(`../handler/apliste.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apliste/programm={programm}`,
    handler: queryApliste,
    config: {
      validate: {
        params: {
          programm: Joi.string().required(),
        }
      }
    }
  }
]
