'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../../escapeStringForSql`)

const buildChildForJBer = (JBerJahr, jberUebersichtListe) => {
  // zuerst den Datensatz extrahieren
  const jberUebersicht = jberUebersichtListe.find(jberUeb => jberUeb.JbuJahr === JBerJahr)

  if (jberUebersicht) {
    return [{
      data: `Übersicht zu allen Arten`,
      attr: {
        id: jberUebersicht.JbuJahr,
        typ: `jberUebersicht`
      }
    }]
  }
  return null
}

const buildChildrenForJBerOrdner = (jberListe, jberUebersichtListe) =>
  jberListe.map((jber) => {
    const beschriftung = jber.JBerJahr ? jber.JBerJahr.toString() : `(kein Jahr)`
    const object = {
      data: beschriftung,
      attr: {
        id: jber.JBerId,
        typ: `jber`
      }
    }
    if (jber.JBerJahr) {
      object.children = buildChildForJBer(jber.JBerJahr, jberUebersichtListe)
    }
    return object
  })

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  let jberListe
  let jberUebersichtListe

  app.db.task(function* getData() {
    // query ber and jberUebersicht first
    jberListe = yield app.db.any(`
      SELECT
        "JBerId",
        "ApArtId",
        "JBerJahr"
      FROM
        apflora.apber
      WHERE
        "ApArtId" = ${apId}
      ORDER BY
        "JBerJahr"`
    )
    jberUebersichtListe = yield app.db.any(`SELECT "JbuJahr" FROM apflora.apberuebersicht`)
  })
    .then(() => {
      const node = {
        data: `AP-Berichte (${jberListe.length})`,
        attr: {
          id: `apOrdnerJber${apId}`,
          typ: `apOrdnerJber`
        },
        children: buildChildrenForJBerOrdner(jberListe, jberUebersichtListe)
      }

      reply(null, node)
    })
    .catch(error => reply(error, null))
}
