'use strict'

const Joi = require(`joi`)
const queryAnmeldung = require(`../../handler/anmeldung.js`)

module.exports = [
  {
    method: `GET`,
    path: `/anmeldung/name={name}/pwd={pwd}`,
    handler: queryAnmeldung,
    config: {
      validate: {
        params: {
          name: Joi.string().required(),
          pwd: Joi.string().required(),
        }
      }
    }
  }
]
