'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "TPopMassnId",
      apflora.tpopmassn."TPopId",
      "TPopMassnJahr",
      "TPopMassnDatum",
      "MassnTypTxt",
      apflora.pop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON "TPopMassnTyp" = "MassnTypCode"
      INNER JOIN
        apflora.tpop
        ON apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.tpopmassn."TPopId" = ${id}
    ORDER BY
      "TPopMassnJahr",
      "TPopMassnDatum",
      "MassnTypTxt"`
  )
    .then(liste =>
      liste.map(el => ({
        nodeId: `tpopmassn/${el.TPopMassnId}`,
        table: `tpopmassn`,
        row: {
          TPopMassnId: el.TPopMassnId,
          TPopMassnJahr: el.TPopMassnJahr,
          TPopMassnTyp: el.TPopMassnTyp,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `Massnahmen`, el.TPopMassnId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${el.TPopId}/tpopmassn`, `tpopmassn/${el.TPopMassnId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
