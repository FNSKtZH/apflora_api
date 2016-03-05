/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict'

const _ = require('lodash')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  let felder = request.params.felder // Ein Objekt mit allen feldern und deren Werten. PLUS: der id
  const date = new Date().toISOString() // wann gespeichert wird
  let sql
  const configTable = _.find(config.tables, { tabelleInDb: tabelle }) // die table in der Konfiguration, welche die Informationen dieser Tabelle enthält
  const nameMutwannFeld = configTable.mutWannFeld || 'MutWann' // so heisst das MutWann-Feld in dieser Tabelle
  const nameMutWerFeld = configTable.mutWerFeld || 'MutWer' // so heisst das MutWer-Feld in dieser Tabelle
  const tabelleIdFeld = configTable.tabelleIdFeld // so heisst das Schlüsselfeld dieser Tabelle

  felder = JSON.parse(felder)

  // id wird nur für die WHERE-Klausel benutzt
  const id = felder.id
  delete felder.id

  // user wird nur für update-Klausel benutzt
  delete felder.user

  // sql beginnen
  sql = `
    UPDATE
      apflora.${tabelle}
    SET
      "${nameMutwannFeld}" = '${date}',
      "${nameMutWerFeld}" = '${felder.user}'`

  // jetzt für jedes key/value-Paar des Objekts set-Anweisungen generieren
  _.forEach(felder, (feldwert, feldname) => {
    if (feldwert || feldwert === 0) {
      // in Zeichenfeldern Anführungszeichen eliminieren!
      if (typeof feldwert === 'string') {
        feldwert = feldwert.replace('"', '')
      }
      sql += `, "${feldname}" = '${feldwert}'`
    } else {
      // leeres Feld: Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
      sql += `, "${feldname}" = NULL`
    }
  })

  sql += ` WHERE "${tabelleIdFeld}" = ${id}`

  request.pg.client.query(
    sql,
    (err, data) => callback(err, data.rows)
  )
}
