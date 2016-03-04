'use strict'

const app = require('ampersand-app')

module.exports = (request, callback) => {
  console.log('apfDb from app', app.apfDb)
  // get a pg client from the connection pool
  const sql = `
    SELECT
      "AdrId" AS id,
      "AdrName"
    FROM
      apflora.adresse
    ORDER BY
      "AdrName"`
  app.apfDb.query(sql, (error, result) => callback(error, result.rows))
}
