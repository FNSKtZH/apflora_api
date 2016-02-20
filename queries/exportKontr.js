'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT *
      FROM ${view}`
    apfDb.query(sql, (error, data) => {
      // null-werte eliminieren
      data.forEach((object) => {
        Object.keys(object).forEach((key) => {
          if (object[key] === null) object[key] = ''
        })
      })
      callback(error, data)
    })
  })
}
