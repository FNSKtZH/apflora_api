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
        "Label" AS id,
        CONCAT(
          "Label",
          ': ',
          repeat(' ', (7 - char_length("Label"))),
          "Einheit"
          ) AS "Einheit"
        FROM
          beob.adb_lr
        WHERE
          "LrMethodId" = 1
        ORDER BY
          "Label"`
    apfDb.query(sql, (error, result) => callback(error, result.rows))
  })
}
