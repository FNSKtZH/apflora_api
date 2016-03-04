'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        "MassnTypCode" as id,
        "MassnTypTxt"
      FROM
        apflora.tpopmassn_typ_werte
      ORDER BY
        "MassnTypOrd"`
    apfDb.query(sql, (error, result) => callback(error, result.rows))
  })
}
