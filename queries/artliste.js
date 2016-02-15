'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString


module.exports = (request, callback) => {
  // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        "TaxonomieId" AS id,
        CASE
          WHEN "Status" NOT LIKE 'akzeptierter Name'
          THEN CONCAT("Artname", ' (', "Status", ')')
          ELSE "Artname"
        END AS label
      FROM
        beob.adb_eigenschaften
      ORDER BY
        label`
    apfDb.query(sql, (error, result) => {
      callback(error, result.rows)
    })
  })
}
