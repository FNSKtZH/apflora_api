'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    table_schema,
    table_name,
    column_name,
    data_type,
    character_maximum_length
  FROM
    information_schema.columns
  WHERE
    table_schema in ('apflora', 'beob')
  ORDER BY
    table_schema,
    table_name,
    column_name`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
