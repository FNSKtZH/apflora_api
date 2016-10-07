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
    "ZaehleinheitTxt" AS "Einheit",
    "BeurteilTxt" AS "Methode",
    "Anzahl",
     apflora.tpopkontr."TPopKontrId",
     apflora.tpop."TPopId",
     apflora.pop."PopId",
     apflora.ap."ApArtId",
     apflora.ap."ProjId"
    FROM
      apflora.tpopkontrzaehl
      LEFT JOIN
        apflora.tpopkontrzaehl_einheit_werte
        ON apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode" = apflora.tpopkontrzaehl."Zaehleinheit"
      LEFT JOIN
        apflora.tpopkontrzaehl_methode_werte
        ON apflora.tpopkontrzaehl_methode_werte."BeurteilCode" = apflora.tpopkontrzaehl."Methode"
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
        id: el.TPopKontrZaehlId,
        name: `${el.Anzahl ? el.Anzahl : `(keine Anzahl)`} ${el.Einheit ? el.Einheit : `(keine Einheit)`} ${el.Methode ? ` ${el.Methode}` : `(keine Methode)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, el.TPopId, `Feld-Kontrollen`, id, `Zählungen`, el.TPopKontrZaehlId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
