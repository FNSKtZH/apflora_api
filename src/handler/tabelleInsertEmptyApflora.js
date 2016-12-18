'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const config = require(`../../configuration`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  const configTable = _.find(config.tables, { tabelleInDb: tabelle }) // die table in der Konfiguration, welche die Informationen dieser Tabelle enthält
  const nameMutwannFeld = configTable.mutWannFeld || `MutWann` // so heisst das MutWann-Feld in dieser Tabelle
  const nameMutWerFeld = configTable.mutWerFeld || `MutWer` // so heisst das MutWer-Feld in dieser Tabelle
  const tabelleIdFeld = configTable.tabelleIdFeld
  const sql = `
    INSERT INTO
      apflora.${tabelle} ("${nameMutwannFeld}", "${nameMutWerFeld}")
    VALUES
      ('${date}', '${user}')
    RETURNING "${tabelleIdFeld}"`

  app.db.one(sql)
    .then(row => callback(null, row[tabelleIdFeld]))
    .catch(error => callback(error, null))
}
