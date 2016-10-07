'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "TPopMassnBerId",
      apflora.tpopmassnber."TPopId",
      "TPopMassnBerJahr",
      "BeurteilTxt",
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
      liste.map(el => ({
        nodeId: `tpopmassnber/${el.TPopMassnBerId}`,
        table: `tpopmassnber`,
        id: el.TPopMassnBerId,
        name: `${el.TPopMassnBerJahr ? el.TPopMassnBerJahr : `(kein Jahr)`}: ${el.BeurteilTxt ? el.BeurteilTxt : `(keine Beurteilung)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `Massnahmen-Berichte`, el.TPopMassnBerId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
