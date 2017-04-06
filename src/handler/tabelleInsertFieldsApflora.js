/**
 * bekommt einen Datensatz von window.apf.deleted
 * stellt ihn wieder her
 */

'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
// const config = require(`../../configuration`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  // NICHT escapeStringForSql anwenden
  let felder = request.params.felder // Ein Objekt mit allen feldern und deren Werten des wiederherzustellenden Datensatzes

  felder = JSON.parse(felder)

  // Feldnamen und -werte extrahieren
  const feldnamen = Object.keys(felder).join(`","`)
  const feldwerte = _.values(felder).join(`','`).replace(`''`, null)

  // sql beginnen
  const sql = `
    INSERT INTO
      apflora.${tabelle} ("${feldnamen}")
    VALUES
      ('${feldwerte}')
    RETURNING
      *`

  app.db.one(sql)
    .then(row => callback(null, row))
    .catch(error => callback(error, null))
}
