'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
    "TPopKontrZaehlId",
    "Zaehleinheit",
    "Methode",
    "Anzahl",
     apflora.tpopkontr."TPopKontrId",
     apflora.tpop."TPopId",
     apflora.pop."PopId",
     apflora.ap."ApArtId",
     apflora.ap."ProjId"
    FROM
      apflora.tpopkontrzaehl
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
          INNER JOIN
            apflora.tpop
            ON apflora.tpopkontr."TPopId" = apflora.tpop."TPopId"
            INNER JOIN
              apflora.pop
              ON apflora.tpop."PopId" = apflora.pop."PopId"
              INNER JOIN
                apflora.ap
                ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
     apflora.tpopkontrzaehl."TPopKontrId" = ${id}
    ORDER BY
      "TPopKontrZaehlId"`
  )
    .then(liste =>
      liste.map(el => ({
        nodeId: `tpopkontrzaehl/${el.TPopKontrZaehlId}`,
        table: `tpopkontrzaehl`,
        row: {
          TPopKontrZaehlId: el.TPopKontrZaehlId,
          Anzahl: el.Anzahl,
          Zaehleinheit: el.Zaehleinheit,
          Methode: el.Methode,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, el.TPopId, `Feld-Kontrollen`, id, `Zählungen`, el.TPopKontrZaehlId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${el.TPopId}/tpopkontr`, `tpopkontr/${el.TPopKontrId}`, `tpopkontr/${el.TPopKontrId}/tpopkontrzaehl`, `tpopkontrzaehl/${el.TPopKontrZaehlId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
