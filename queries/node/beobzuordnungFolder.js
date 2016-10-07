'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.beobzuordnung."NO_NOTE",
      apflora.beobzuordnung."TPopId",
      apflora.beobzuordnung."BeobNichtZuordnen",
      apflora.beobzuordnung."BeobBemerkungen",
      apflora.beobzuordnung."BeobMutWann",
      apflora.beobzuordnung."BeobMutWer",
      beob.beob_bereitgestellt."Datum",
      beob.beob_bereitgestellt."Autor",
      'evab' AS "beobtyp",
      apflora.pop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        beob.beob_bereitgestellt
        ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."BeobId"
      INNER JOIN
        apflora.tpop
        ON apflora.beobzuordnung."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.beobzuordnung."TPopId" = ${id}
      AND (
        apflora.beobzuordnung."BeobNichtZuordnen" = 0
        OR apflora.beobzuordnung."BeobNichtZuordnen" IS NULL
      )`
  )
    .then(liste =>
      liste.map(el => ({
        nodeId: `beobzuordnung/${el.NO_NOTE}`,
        table: `beobzuordnung`,
        id: el.NO_NOTE,
        name: `${el.Datum ? el.Datum : `(kein Datum)`}: ${el.Autor ? el.Autor : `(kein Autor)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `zugeordnete-Beobachtungen`, el.NO_NOTE],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
