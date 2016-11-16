'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.popmassnber.*,
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.popmassnber
      LEFT JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON "PopMassnBerErfolgsbeurteilung" = "BeurteilId"
      INNER JOIN
        apflora.pop
        ON apflora.popmassnber."PopId" = apflora.pop."PopId"
        INNER JOIN
          apflora.ap
          ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.popmassnber."PopId" = ${id}
    ORDER BY
      "PopMassnBerJahr",
      "BeurteilOrd"`
  )
    .then(apListe =>
      apListe.map(row => ({
        nodeId: `popmassnber/${row.PopMassnBerId}`,
        table: `popmassnber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, id, `Massnahmen-Berichte`, row.PopMassnBerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/popmassnber`, `popmassnber/${row.PopMassnBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
