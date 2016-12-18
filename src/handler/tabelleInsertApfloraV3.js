'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const escapeStringForSql = require(`../escapeStringForSql`)
const config = require(`../../configuration`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  const feld = escapeStringForSql(request.params.feld) // der Name des Felds, dessen Daten gespeichert werden sollen
  const wert = escapeStringForSql(request.params.wert) // der Wert, der gespeichert werden soll
  const configTable = _.find(config.tables, { tabelleInDb: tabelle }) // die table in der Konfiguration, welche die Informationen dieser Tabelle enthält
  const tabelleIdFeld = configTable.tabelleIdFeld

  app.db.one(`
    INSERT INTO
      apflora.${tabelle} ("${feld}")
    VALUES
      ('${wert}')
    RETURNING "${tabelleIdFeld}"
  `)
    .then(data => app.db.one(`
        SELECT
          *
        FROM
          apflora.${tabelle}
        WHERE
          "${tabelleIdFeld}" = $1
      `, data[tabelleIdFeld]))
    .then(row => callback(null, row))
    .catch(error => callback(error, null))
}
