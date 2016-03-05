'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId) // die id
  const tpopKontrtyp = escapeStringForSql(request.params.tpopKontrtyp) // feldkontr oder freiwkontr
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let sql = `
    INSERT INTO apflora.tpopkontr ("TPopId", "MutWann", "MutWer")
    VALUES (${tpopId}, '${date}', '${user}')
    RETURNING tpopkontr."TPopKontrId"`

  // sql schreiben
  if (tpopKontrtyp === 'tpopfreiwkontr') {
    sql = `
      INSERT INTO apflora.tpopkontr ("TPopId", "TPopKontrTyp", "MutWann", "MutWer")
      VALUES (${tpopId}, 'Freiwilligen-Erfolgskontrolle', '${date}', '${user}')
      RETURNING tpopkontr."TPopKontrId"`
  }
  request.pg.client.query(sql, (error, result) => callback(error, result))
}
