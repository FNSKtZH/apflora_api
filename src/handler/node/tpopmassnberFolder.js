'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.tpopmassnber.*,
      apflora.pop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.tpopmassnber
      LEFT JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON "TPopMassnBerErfolgsbeurteilung" = "BeurteilId"
      INNER JOIN
        apflora.tpop
        ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.tpopmassnber."TPopId" = ${id}
    ORDER BY
      "TPopMassnBerJahr",
      "BeurteilTxt"`
  )
    .then(liste =>
      liste.map(row => ({
        nodeId: `tpopmassnber/${row.TPopMassnBerId}`,
        table: `tpopmassnber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId, `Teil-Populationen`, id, `Massnahmen-Berichte`, row.TPopMassnBerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/tpop`, `tpop/${row.TPopId}/tpopmassnber`, `tpopmassnber/${row.TPopMassnBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
