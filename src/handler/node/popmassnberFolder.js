'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "PopMassnBerId",
      apflora.popmassnber."PopId",
      "PopMassnBerJahr",
      "BeurteilTxt",
      "BeurteilOrd",
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
      apListe.map(el => ({
        nodeId: `popmassnber/${el.PopMassnBerId}`,
        table: `popmassnber`,
        row: {
          PopMassnBerId: el.PopMassnBerId,
          PopMassnBerJahr: el.PopMassnBerJahr,
          BeurteilTxt: el.BeurteilTxt,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, id, `Massnahmen-Berichte`, el.PopMassnBerId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/popmassnber`, `popmassnber/${el.PopMassnBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
