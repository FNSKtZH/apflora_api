'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzeNrUmFuehrendeNullen = require(`../../ergaenzeNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "TPopNr",
      "TPopFlurname",
      "TPopId",
      apflora.tpop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.pop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
        INNER JOIN
          apflora.ap
          ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.tpop."PopId" = ${id}
    ORDER BY
      "TPopNr",
      "TPopFlurname"`
  )
    .then((liste) => {
      let tpopListe = liste
      // TPopNr: Je nach Anzahl Stellen der maximalen TPopNr bei denjenigen mit weniger Nullen
      // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
      const tpopNrMax = _.max(tpopListe, tpop => tpop.TPopNr).TPopNr
      tpopListe.forEach((tpop) => {
        tpop.sort = tpop.TPopNr ? tpop.TPopNr : 1000
        tpop.TPopNr = ergaenzeNrUmFuehrendeNullen(tpopNrMax, tpop.TPopNr)
      })
      tpopListe = _.sortBy(tpopListe, `sort`)
      return tpopListe.map(el => ({
        nodeId: `tpop/${el.TPopId}`,
        table: `tpop`,
        id: el.TPopId,
        name: `${el.TPopNr ? el.TPopNr : `(keine Nr)`}: ${el.TPopFlurname ? el.TPopFlurname : `(kein Flurname)`}`,
        expanded: false,
        children: [0],
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, id, `Teil-Populationen`, el.TPopId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${el.TPopId}`],
      }))
    })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
