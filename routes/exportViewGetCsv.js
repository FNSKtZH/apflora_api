'use strict'

const escapeStringForSql = require('../queries/escapeStringForSql.js')
const exportView = require('../queries/exportView.js')
const json2csv = require('json2csv')

module.exports = {
  method: 'GET',
  path: '/exportView/csv/view={view}/filename={filename}',
  handler (request, reply) {
    const filename = escapeStringForSql(request.params.filename)
    exportView(request, (err, data) => {
      const fields = Object.keys(data[0])
      if (err) return reply(err)
      json2csv(
        { data, fields },
        (err, csv) => {
          if (err) return reply(err)
          reply(csv)
            .header('Content-Type', 'text/x-csv; charset=utf-8')
            .header('Content-disposition', `attachment; filename=${filename}.csv`)
            .header('Pragma', 'no-cache')
            .header('Set-Cookie', 'fileDownload=true; path=/')
        }
      )
    })
  }
}
