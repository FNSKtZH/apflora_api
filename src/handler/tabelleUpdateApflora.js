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
  let wert = escapeStringForSql(request.params.wert) // der Wert, der gespeichert werden soll
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  const table = _.find(config.tables, { tabelleInDb: tabelle }) // Infos über die Tabelle holen
  // achtung: wenn eine nicht existente Tabelle übergeben wurde, gibt das einen Fehler, daher abfangen
  const mutWannFeld = table ? table.mutWannFeld : null // so heisst das Feld für MutWann
  const mutWerFeld = table ? table.mutWerFeld : null // so heisst das Feld für MutWer
  // null kommt als `null` an:
  if (wert === `null`) {
    wert = null
  }

  const checkDatatype = (dataTypes, field, value) => {
    const dataType = dataTypes[0].data_type
    switch (dataType) {
      case `integer`: {
        const validDataType = Joi.validate(
          value,
          Joi.number()
            .integer()
            .min(-2147483648)
            .max(+2147483647)
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' entspricht nicht dem Datentyp 'integer' des Felds '${field}'`))
        }
        break
      }
      case `smallint`: {
        const validDataType = Joi.validate(
          value,
          Joi.number()
            .integer()
            .min(-32768)
            .max(+32767)
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' entspricht nicht dem Datentyp 'integer' des Felds '${field}'`))
        }
        break
      }
      case `double precision`: {
        const validDataType = Joi.validate(
          value,
          Joi.number()
            .precision(15)
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' im Feld '${field}' muss eine Nummer sein`))
        }
        break
      }
      case `character varying`: {
        const validDataType = Joi.validate(
          value,
          Joi.alternatives()
            .try(
              Joi.number(),
              Joi.string()
            )
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' entspricht nicht dem Datentyp 'character varying' des Felds '${field}'`))
        }
        // - if field type is varchar: check if value length complies to character_maximum_length
        const maxLen = dataTypes[0].character_maximum_length
        if (maxLen) {
          const validDataType2 = Joi.validate(
            value,
              Joi.alternatives()
                .try(
                  Joi.string()
                    .max(maxLen),
                  Joi.number()
                )
                .allow(``)
                .allow(null)
          )
          if (validDataType2.error) {
            return callback(Boom.badRequest(`Der Wert '${value}' ist zu lang für das Feld '${field}'. Erlaubt sind ${maxLen} Zeichen`))
          }
        }
        break
      }
      case `uuid`: {
        const validDataType = Joi.validate(
          value,
          Joi.string()
            .guid()
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' entspricht nicht dem Datentyp 'uuid' des Felds '${field}'`))
        }
        break
      }
      case `date`: {
        const validDataType = Joi.validate(
          value,
          Joi.string()
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' entspricht nicht dem Datentyp 'date' des Felds '${field}'`))
        }
        break
      }
      case `text`: {
        const validDataType = Joi.validate(
          value,
          Joi.alternatives()
            .try(
              Joi.number(),
              Joi.string()
            )
            .allow(``)
            .allow(null)
        )
        if (validDataType.error) {
          return callback(Boom.badRequest(`Der Wert '${value}' entspricht nicht dem Datentyp 'text' des Felds '${field}'`))
        }
        break
      }
      default:
        // do nothing
    }
  }

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
      return callback(Boom.notFound(`Die Tabelle '${tabelle}' existiert nicht`))
    }
    // - check if this tabelleIdFeld exists in column_name
    const datentypenDesIdFelds = felderDerTabelle.filter(f => f.column_name === tabelleIdFeld)
    if (datentypenDesIdFelds.length === 0) {
      return callback(Boom.notFound(`Das Feld '${tabelleIdFeld}' existiert nicht`))
    }
    // - check if the wert complies to data_type
    checkDatatype(datentypenDesIdFelds, tabelleIdFeld, tabelleId)
    // - check if feld exists in column_name
    const datentypenDesFelds = felderDerTabelle.filter(f => f.column_name === feld)
    if (datentypenDesFelds.length === 0) {
      return callback(Boom.notFound(`Das Feld '${feld}' existiert nicht`))
    }
    // - check if the wert complies to data_type
    checkDatatype(datentypenDesFelds, feld, wert)
    app.db.any(sql)
      .then(rows => callback(null, rows))
      .catch(err => callback(err, null))
  })
}
