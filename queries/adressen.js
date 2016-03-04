'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
      "AdrId" AS id,
      "AdrName"
    FROM
      apflora.adresse
    ORDER BY
      "AdrName"`
    apfDb.query(sql, (error, result) => callback(error, result.rows))
  })
}
