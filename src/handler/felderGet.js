'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
