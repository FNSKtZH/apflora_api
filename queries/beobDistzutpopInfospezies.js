'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const beobId = escapeStringForSql(request.params.beobId)

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        beob.beob_infospezies.NO_NOTE,
        beob.beob_infospezies.NO_ISFS,
        apflora.tpop.TPopId,
        beob.beob_infospezies.FNS_XGIS,
        beob.beob_infospezies.FNS_YGIS,
        TPopXKoord,
        TPopYKoord,
        PopNr,
        TPopNr,
        TPopFlurname,
        SQRT(
          power((beob.beob_infospezies.FNS_XGIS - TPopXKoord), 2) +
          power((beob.beob_infospezies.FNS_YGIS - TPopYKoord), 2)
        ) AS DistZuTPop
      FROM beob.beob_infospezies
        INNER JOIN (apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId) ON NO_ISFS = ApArtId
      WHERE NO_NOTE = "${beobId}"
        AND TPopXKoord IS NOT NULL
        AND TPopYKoord IS NOT NULL
        AND FNS_XGIS IS NOT NULL
        AND FNS_YGIS IS NOT NULL
      ORDER BY
        DistzuTPop,
        TPopFlurname`
    apfDb.query(sql, (error, result) => {
      callback(error, result.rows)
    })
  })
}
