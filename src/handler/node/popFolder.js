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
        apflora.pop.*,
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
      return popList.map(row => ({
        nodeId: `pop/${row.PopId}`,
        table: `pop`,
        row,
        expanded: false,
        children: [0],
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`],
      }))
    })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
