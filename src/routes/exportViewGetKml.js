'use strict'

const exportView = require(`../../queries/exportView.js`)
const getKmlForPop = require(`../getKmlForPop.js`)
const getKmlForTpop = require(`../getKmlForTpop.js`)

module.exports = [
  {
    method: `GET`,
    path: `/exportView/kml/view={view}/filename={filename}`,
    handler(request, reply) {
      const filename = request.params.filename
      const view = request.params.view
      let kml

      exportView(request, (err, data) => {
        if (err) return reply(err)
        switch (view) {
          case `v_pop_kml`:
          case `v_pop_kmlnamen`:
            kml = getKmlForPop(data)
            break
          case `v_tpop_kml`:
          case `v_tpop_kmlnamen`:
            kml = getKmlForTpop(data)
            break
          default:
            return reply(new Error(`did not receive expected view`))
        }
        if (kml) {
          reply(kml)
            .header(`Content-Type`, `application/vnd.google-earth.kml+xml kml; charset=utf-8`)
            .header(`Content-disposition`, `attachment; filename=${filename}.kml`)
            .header(`Pragma`, `no-cache`)
            .header(`Set-Cookie`, `fileDownload=true; path=/`)
        }
      })
    }
  }
]
