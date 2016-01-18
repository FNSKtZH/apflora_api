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

module.exports = (request, callback) => {
  const userName = escapeStringForSql(request.params.name)
  const password = escapeStringForSql(request.params.pwd)

  connection.query(`
    SELECT NurLesen
    FROM user
    WHERE UserName = "${userName}"
      AND Passwort = "${password}"`,
    (err, data) => callback(err, data)
  )
}
