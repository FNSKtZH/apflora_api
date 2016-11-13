/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const Joi = require(`joi`)
const Boom = require(`boom`)
const config = require(`../../configuration`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  const tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld) // der Name der ID der Tabelle
  const tabelleId = escapeStringForSql(request.params.tabelleId) // der Wert der ID
  const feld = escapeStringForSql(request.params.feld) // der Name des Felds, dessen Daten gespeichert werden sollen
  const wert = escapeStringForSql(request.params.wert) // der Wert, der gespeichert werden soll
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  const table = _.find(config.tables, { tabelleInDb: tabelle }) // Infos über die Tabelle holen
  // achtung: wenn eine nicht existente Tabelle übergeben wurde, gibt das einen Fehler, daher abfangen
  const mutWannFeld = table ? table.mutWannFeld : null // so heisst das Feld für MutWann
  const mutWerFeld = table ? table.mutWerFeld : null // so heisst das Feld für MutWer

  // console.log(`tabelleUpdateApflora: wert bekommen:`, request.params.wert)
  // console.log(`tabelleUpdateApflora: wert nach escape:`, wert)

  let sql = `
    UPDATE
      apflora.${tabelle}
    SET
      "${feld}" = '${wert}',
      "${mutWannFeld}" = '${date}',
      "${mutWerFeld}" = '${user}'
    WHERE
      "${tabelleIdFeld}" = '${tabelleId}'`
  // Ist ein Feld neu leer, muss NULL übergeben werden. wert ist dann 'undefined'
  if (!wert) {
    sql = `
      UPDATE
        apflora.${tabelle}
      SET
        "${feld}" = NULL,
        "${mutWannFeld}" = '${date}',
        "${mutWerFeld}" = '${user}'
      WHERE
        "${tabelleIdFeld}" = '${tabelleId}'`
  }

  app.server.methods.felder((error, felder) => {
    if (error) {
      return callback(error, null)
    }
    // check felder to:
    // - check if this table exists in table_name
    const felderVonApflora = felder.filter(f => f.table_schema === `apflora`)
    const felderDerTabelle = felderVonApflora.filter(f => f.table_name === tabelle)
    if (felderDerTabelle.length === 0) {
      return callback(Boom.badRequest(`Die Tabelle '${tabelle}' existiert nicht`))
    }
    // - check if this tabelleIdFeld exists in column_name
    const datentypenDesIdFelds = felderDerTabelle.filter(f => f.column_name === tabelleIdFeld)
    if (datentypenDesIdFelds.length === 0) {
      return callback(Boom.badRequest(`Das Feld '${tabelleIdFeld}' existiert nicht`))
    }
    // - check if feld exists in column_name
    const datentypenDesFelds = felderDerTabelle.filter(f => f.column_name === feld)
    if (datentypenDesFelds.length === 0) {
      return callback(Boom.badRequest(`Das Feld '${feld}' existiert nicht`))
    }
    // - check if the wert complies to data_type
    const dataType = datentypenDesFelds[0].data_type
    switch (dataType) {
      case `integer`: {
        const validDataType = Joi.validate(wert, Joi.number().integer().min(-2147483648).max(+2147483647))
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' entspricht nicht dem Datentyp 'integer' des Felds '${feld}'`))
        }
        break
      }
      case `smallint`: {
        const validDataType = Joi.validate(wert, Joi.number().integer().min(-32768).max(+32767))
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' entspricht nicht dem Datentyp 'integer' des Felds '${feld}'`))
        }
        break
      }
      case `double precision`: {
        const validDataType = Joi.validate(wert, Joi.number().precision(15))
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' im Feld '${feld}' muss eine Nummer sein`))
        }
        break
      }
      case `character varying`: {
        const validDataType = Joi.validate(wert, Joi.string().allow(``))
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' entspricht nicht dem Datentyp 'character varying' des Felds '${feld}'`))
        }
        // - if field type is varchar: check if wert length complies to character_maximum_length
        const maxLen = datentypenDesFelds[0].character_maximum_length
        if (maxLen) {
          const validDataType2 = Joi.validate(wert, Joi.string().max(maxLen))
          if (validDataType2.error) {
            return callback(Boom.badRequest(`Der Wert '${wert}' ist zu lang für das Feld '${feld}'. Erlaubt sind ${maxLen} Zeichen`))
          }
        }
        break
      }
      case `uuid`: {
        const validDataType = Joi.validate(wert, Joi.string().guid())
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' entspricht nicht dem Datentyp 'uuid' des Felds '${feld}'`))
        }
        break
      }
      case `date`: {
        const validDataType = Joi.validate(wert, Joi.string())
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' entspricht nicht dem Datentyp 'date' des Felds '${feld}'`))
        }
        break
      }
      case `text`: {
        const validDataType = Joi.validate(wert, Joi.string().allow(``))
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${wert}' entspricht nicht dem Datentyp 'text' des Felds '${feld}'`))
        }
        break
      }
      default:
        // do nothing
    }
    app.db.any(sql)
      .then(rows => callback(null, rows))
      .catch(err => callback(err, null))
  })
}
