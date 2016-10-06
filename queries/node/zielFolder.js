'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.many(`
    SELECT
      apflora.ziel."ApArtId",
      apflora.ziel."ZielId",
      apflora.ziel_typ_werte."ZieltypTxt",
      apflora.ziel."ZielJahr",
      apflora.ziel."ZielBezeichnung",
      apflora.ap."ProjId"
    FROM
      apflora.ziel
      INNER JOIN
        apflora.ap
        ON apflora.ziel."ApArtId" = apflora.ap."ApArtId"
      LEFT JOIN
        apflora.ziel_typ_werte
        ON apflora.ziel."ZielTyp" = apflora.ziel_typ_werte."ZieltypId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      apflora.ziel."ZielJahr" DESC,
      "ZielBezeichnung"`
  )
    .then(list =>
      list.map(el => ({
        nodeId: `ziel/${el.ZielId}`,
        table: `ziel`,
        id: el.ZielId,
        name: `${el.ZielJahr ? `${el.ZielJahr}` : `(kein Jahr)`}: ${el.ZielBezeichnung} (${el.ZieltypTxt})`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `AP-Ziele`, el.ZielId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
