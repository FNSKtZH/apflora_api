'use strict'

var _ = require('underscore')
var escapeStringForSql = require('./escapeStringForSql')

module.exports = function (array) {
  var eigenschaftenString = ''

  _.each(_.first(array, 6000), function (object, index) {
    if (index > 0) {
      eigenschaftenString += ','
    }
    eigenschaftenString += '('

    // sicherstellen, dass strings keine unerlaubten Zeichen enthalten
    _.each(object, function (value, key) {
      if (typeof value === 'string') {
        object[key] = "'" + escapeStringForSql(value) + "'"
      } else if (value === null) {
        object[key] = 'NULL'
      } else if (typeof value === 'object') {
        // das muss ein Array von Werten sein
        // in Zeichen umwandeln und in Hochzeichen einschliessen
        object[key] = "'" + value.join(', ') + "'"
      }
    })
    // Werte kommagetrennt hintereinander schreiben
    eigenschaftenString += _.values(object)

    eigenschaftenString += ')'
  })

  return eigenschaftenString
}
