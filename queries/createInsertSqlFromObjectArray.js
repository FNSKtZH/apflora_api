'use strict'

const _ = require('lodash')
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (array) => {
  let eigenschaftenString = ''

  _.head(array, 6000).forEach((object, index) => {
    if (index > 0) eigenschaftenString += ','
    eigenschaftenString += '('

    // sicherstellen, dass strings keine unerlaubten Zeichen enthalten
    Object.keys(object).forEach((key) => {
      const value = object[key]
      if (typeof value === 'string') {
        object[key] = `'${escapeStringForSql(value)}'`
      } else if (value === null) {
        object[key] = 'NULL'
      } else if (typeof value === 'object') {
        // das muss ein Array von Werten sein
        // in Zeichen umwandeln und in Hochzeichen einschliessen
        object[key] = `'${value.join(', ')}'`
      }
    })
    // Werte kommagetrennt hintereinander schreiben
    eigenschaftenString += _.values(object)

    eigenschaftenString += ')'
  })

  return eigenschaftenString
}
