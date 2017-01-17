'use strict'

const Joi = require(`joi`)
const escapeStringForSql = require(`../escapeStringForSql.js`)
const exportView = require(`../handler/exportView.js`)
const json2csv = require(`json2csv`)

module.exports = [
  {
    method: `GET`,
    path: `/exportView/csv/view={view}/filename={filename}`,
    handler(request, reply) {
      const filename = escapeStringForSql(request.params.filename)
      exportView(request, (err, data) => {
        if (!data || (data.length && data.length === 0)) {
          reply(`"keine Daten erfüllen dieses Kriterium"`)
            .header(`Content-Type`, `text/x-csv; charset=utf-8`)
            .header(`Content-disposition`, `attachment; filename=${filename}.csv`)
            .header(`Pragma`, `no-cache`)
            .header(`Set-Cookie`, `fileDownload=true; path=/`)
        }
        const fields = Object.keys(data[0])
        if (err) return reply(err)
        json2csv(
          { data, fields },
          (error, csv) => {
            if (error) return reply(error)
            reply(csv)
              .header(`Content-Type`, `text/x-csv; charset=utf-8`)
              .header(`Content-disposition`, `attachment; filename=${filename}.csv`)
              .header(`Pragma`, `no-cache`)
              .header(`Set-Cookie`, `fileDownload=true; path=/`)
          }
        )
      })
    },
    config: {
      validate: {
        params: {
          view: Joi.string().required(),
          filename: Joi.string().required(),
        }
      }
    }
  }
]
