'use strict'

const escapeStringForSql = require('./escapeStringForSql')
const pg = require('pg')
const dbPass = require('../pgDbPass.json')
const user = dbPass.user
const pwd = dbPass.pass
const connectionString = `postgres://${user}:${pwd}@localhost/apflora`

module.exports = (request, callback) => {
  const userName = escapeStringForSql(request.params.name)
  const password = escapeStringForSql(request.params.pwd)

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        "NurLesen"
      FROM
        apflora."user"
      WHERE
        "UserName" = '${userName}'
        AND "Passwort" = '${password}'`
    apfDb.query(sql, (error, result) => {
      callback(error, result.rows)
    })
  })
}
