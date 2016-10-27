'use strict'

const Joi = require(`joi`)
const exportView = require(`../../handler/exportView.js`)

module.exports = [
  {
    method: `GET`,
    path: `/exportView/xslx/view={view}`,
    handler(request, reply) {
      exportView(request, (err, data) => {
        if (err) return reply(err)
        reply(data)
          .header(`Content-Type`, `application/json;`)
          .header(`Accept`, `application/json;`)
          .header(`Pragma`, `no-cache`)
      })
    },
    config: {
      validate: {
        params: {
          view: Joi.string().required(),
        }
      }
    }
  }
]
