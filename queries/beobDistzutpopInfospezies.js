'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, callback) {
  var beobId = escapeStringForSql(request.params.beobId)

  connection.query(
    'SELECT NO_NOTE, NO_ISFS, apflora.tpop.TPopId, FNS_XGIS, FNS_YGIS, TPopXKoord, TPopYKoord, PopNr, TPopNr, TPopFlurname, SQRT((FNS_XGIS-TPopXKoord)*(FNS_XGIS-TPopXKoord)+(FNS_YGIS-TPopYKoord)*(FNS_YGIS-TPopYKoord)) AS DistZuTPop FROM apflora_beob.beob_infospezies INNER JOIN (apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE ="' + beobId + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND FNS_XGIS IS NOT NULL AND FNS_YGIS IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
    function (err, data) {
      callback(err, data)
    }
  )
}
