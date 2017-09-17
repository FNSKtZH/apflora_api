'use strict'

const Joi = require(`joi`)
const queryGet = require(`../handler/usermessageGetByUser.js`)
const queryInsert = require(`../handler/usermessagePost.js`)

module.exports = [
  // get all usermessages of a user
  {
    method: `GET`,
    path: `/usermessage/{userName}`,
    handler: queryGet,
    config: {
      validate: {
        params: {
          userName: Joi.string().required(),
        },
      },
    },
  },
  // post that a user has read a message
  {
    method: `POST`,
    path: `/usermessage/{userName}/{messageId}`,
    handler: queryInsert,
    config: {
      validate: {
        params: {
          userName: Joi.string().required(),
          messageId: Joi.number().required(),
        },
      },
    },
  },
]
