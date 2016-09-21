'use strict'

const _ = require(`lodash`)
const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (array) => {
  let eigenschaftenString = ``

  array.forEach((object, index) => {
    if (index > 0) eigenschaftenString += `,`
    eigenschaftenString += `(`

    // ensure length of varchars
    if (object.Status) object.Status = object.Status.substring(0, 47)
    if (object.Familie) object.Familie = object.Familie.substring(0, 100)
    if (object.Artname) object.Artname = object.Artname.substring(0, 100)
    if (object.NameDeutsch) object.NameDeutsch = object.NameDeutsch.substring(0, 100)

    // sicherstellen, dass strings keine unerlaubten Zeichen enthalten
    Object.keys(object).forEach((key) => {
      const value = object[key]
      if (typeof value === `string`) {
        object[key] = `'${escapeStringForSql(value)}'`
      } else if (value === null) {
        object[key] = `NULL`
      } else if (typeof value === `object`) {
        // das muss ein Array von Werten sein
        // in Zeichen umwandeln und in Hochzeichen einschliessen
        object[key] = `'${value.join(`, `)}'`
      }
    })
    // Werte kommagetrennt hintereinander schreiben
    eigenschaftenString += _.values(object)

    eigenschaftenString += `)`
  })

  return eigenschaftenString
}
