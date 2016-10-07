'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzeNrUmFuehrendeNullen = require(`../../src/ergaenzeNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
      SELECT
        "PopNr",
        "PopName",
        "PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.pop
        INNER JOIN
          apflora.ap
          ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        "PopNr",
        "PopName"`
  )
    .then((list) => {
      let popList = list
      // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
      // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
      const popNrMax = _.max(popList, pop => pop.PopNr).PopNr
      popList.forEach((pop) => {
        pop.sort = pop.PopNr ? pop.PopNr : 1000
        pop.PopNr = ergaenzeNrUmFuehrendeNullen(popNrMax, pop.PopNr)
      })
      popList = _.sortBy(popList, `sort`)
      return popList.map(el => ({
        nodeId: `pop/${el.PopId}`,
        table: `pop`,
        id: el.PopId,
        name: `${el.PopNr ? el.PopNr : `(keine Nr)`}: ${el.PopName ? el.PopName : `(kein Name)`}`,
        expanded: false,
        children: [0],
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
      }))
    })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
