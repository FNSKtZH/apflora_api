'use strict'

const Joi = require(`joi`)
const queryMessage = require(`../handler/messageGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/message`,
    handler: queryMessage,
  },
]
