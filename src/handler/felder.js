'use strict'

const app = require(`ampersand-app`)

module.exports = next =>
  app.db.any(`
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
  )
    .then(rows => next(null, rows))
    .catch((error) => {
      throw new Error(error)
    })
