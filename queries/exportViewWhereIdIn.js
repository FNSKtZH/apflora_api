'use strict'

const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen
  const idName = escapeStringForSql(request.params.idName) // name des Felds, für den ID's übergeben werden
  const idListe = escapeStringForSql(request.params.idListe) // liste der ID's
  const sql = `
    SELECT
      *
    FROM
      views.${view}
    WHERE
      "${idName}" IN (${idListe})`

  request.pg.client.query(sql, (err, result) => {
    if (err) callback(err, null)
    const data = result.rows
    // null-werte eliminieren
    data.forEach((object) => {
      Object.keys(object).forEach((key) => {
        if (object[key] === null) object[key] = ``
      })
    })
    callback(err, data)
  })
}
