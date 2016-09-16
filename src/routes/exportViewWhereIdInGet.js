'use strict'

const json2csv = require(`json2csv`)
const exportViewWhereIdIn = require(`../../queries/exportViewWhereIdIn.js`)
const escapeStringForSql = require(`../../queries/escapeStringForSql.js`)

module.exports = [
  {
    method: `GET`,
    path: `/exportViewWhereIdIn/csv/view={view}/idName={idName}/idListe={idListe}/filename={filename}`,
    handler(request, reply) {
      const filename = escapeStringForSql(request.params.filename)
      exportViewWhereIdIn(request, (err, data) => {
        if (err) return reply(err)
        const fields = Object.keys(data[0])
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
    }
  }
]
