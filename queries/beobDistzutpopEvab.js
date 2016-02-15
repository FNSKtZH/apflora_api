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
        beob.beob_evab."NO_NOTE_PROJET",
        beob.beob_evab."NO_ISFS",
        apflora.tpop."TPopId",
        beob.beob_evab."COORDONNEE_FED_E",
        beob.beob_evab."COORDONNEE_FED_N",
        apflora.tpop."TPopXKoord",
        apflora.tpop."TPopYKoord",
        apflora.pop."PopNr",
        apflora.tpop."TPopNr",
        apflora.tpop."TPopFlurname",
        sqrt((beob.beob_evab."COORDONNEE_FED_E" - apflora.tpop."TPopXKoord") * (beob.beob_evab."COORDONNEE_FED_E" - apflora.tpop."TPopXKoord") + (beob.beob_evab."COORDONNEE_FED_N" - apflora.tpop."TPopYKoord") * (beob.beob_evab."COORDONNEE_FED_N" - apflora.tpop."TPopYKoord")) AS "DistZuTPop"
      FROM
        beob.beob_evab
        INNER JOIN
          (apflora.pop
            INNER JOIN
              apflora.tpop
              ON apflora.pop."PopId" = apflora.tpop."PopId")
          ON beob.beob_evab."NO_ISFS" = apflora.pop."ApArtId"
      WHERE
        beob.beob_evab."NO_NOTE_PROJET" = '${beobId}'
        AND apflora.tpop."TPopXKoord" IS NOT NULL
        AND apflora.tpop."TPopYKoord" IS NOT NULL
        AND beob.beob_evab."COORDONNEE_FED_E" IS NOT NULL
        AND beob.beob_evab."COORDONNEE_FED_N" IS NOT NULL
      ORDER BY
        "DistZuTPop",
        apflora.tpop."TPopFlurname"`
    apfDb.query(sql, (error, result) => {
      callback(error, result.rows)
    })
  })
}
