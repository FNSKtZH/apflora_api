'use strict'

const async = require(`async`)
const escapeStringForSql = require(`../escapeStringForSql`)

const buildChildForJBer = (JBerJahr, jberUebersichtListe) => {
  // zuerst den Datensatz extrahieren
  const jberUebersicht = jberUebersichtListe.find(jberUebersicht => jberUebersicht.JbuJahr === JBerJahr)

  if (jberUebersicht) {
    const object = {
      data: `Übersicht zu allen Arten`,
      attr: {
        id: jberUebersicht.JbuJahr,
        typ: `jberUebersicht`
      }
    }
    return [object]
  }
  return null
}

const buildChildrenForJBerOrdner = (results) => {
  return results.jberListe.map((jber) => {
    const beschriftung = jber.JBerJahr ? jber.JBerJahr.toString() : `(kein Jahr)`
    const object = {
      data: beschriftung,
      attr: {
        id: jber.JBerId,
        typ: `jber`
      }
    }
    if (jber.JBerJahr) object.children = buildChildForJBer(jber.JBerJahr, results.jberUebersichtListe)
    return object
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  // query ber AND jberUebersicht first
  async.parallel({
    jberListe(callback) {
      request.pg.client.query(
        `SELECT
          "JBerId",
          "ApArtId",
          "JBerJahr"
        FROM
          apflora.apber
        WHERE
          "ApArtId" = ${apId}
        ORDER BY
          "JBerJahr"`,
        (err, jber) => callback(err, jber.rows)
      )
    },
    jberUebersichtListe(callback) {
      request.pg.client.query(
        `SELECT "JbuJahr" FROM apflora.apberuebersicht`,
        (err, jberUebersicht) => callback(err, jberUebersicht.rows)
      )
    }
  }, (err, results) => {
    if (err) return reply(err)
    const jberListe = results.jberListe
    const node = {
      data: `AP-Berichte (${jberListe.length})`,
      attr: {
        id: `apOrdnerJber${apId}`,
        typ: `apOrdnerJber`
      },
      children: buildChildrenForJBerOrdner(results)
    }

    reply(null, node)
  })
}
