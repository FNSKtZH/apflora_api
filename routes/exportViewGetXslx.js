'use strict'

const exportView = require('../queries/exportView.js')

module.exports = [
  {
    method: 'GET',
    path: '/exportView/xslx/view={view}',
    // handler: exportView
    handler (request, reply) {
      exportView(request, (err, data) => {
        if (err) return reply(err)
        reply(data)
          .header('Content-Type', 'application/json;')
          .header('Accept', 'application/json;')
          // .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
          .header('Pragma', 'no-cache')
      // .header('Set-Cookie', 'fileDownload=true; path=/')
      })
    }
  }
]
