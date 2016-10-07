'use strict'

const app = require(`ampersand-app`)

// TODO: get real user

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  const user = 23

  if (id) {
    id = parseInt(id, 0)
  }


  app.db.any(`
    SELECT
      "ProjId",
      "ProjName",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.ap
        WHERE
          apflora.ap."ProjId" = apflora.projekt."ProjId"
      ) AS "AnzAp",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.apberuebersicht
        WHERE
          apflora.apberuebersicht."ProjId" = apflora.projekt."ProjId"
      ) AS "AnzApberuebersicht"
    FROM
      apflora.projekt
    WHERE
      "ProjId" IN (
        SELECT
          "ProjId"
        FROM
          apflora.userprojekt
        WHERE
          "UserId" = $1
      )
    ORDER BY
      "ProjName"
    `,
    user
  )
    .then(projektListe =>
      projektListe.map((projekt) => {
        const idActive = !!id && id === projekt.ProjId
        // const oneProject = projektListe.length === 1  // temporarily disabled
        return {
          nodeId: `projekt/${projekt.ProjId}`,
          table: `projekt`,
          id: projekt.ProjId,
          name: projekt.ProjName,
          expanded: idActive, // || oneProject,  // temporarily disabled
          urlPath: [`Projekte`, projekt.ProjId],
          children: [
            // ap folder
            {
              nodeId: `projekt/${projekt.ProjId}/ap`,
              folder: `ap`,
              table: `projekt`,
              id: projekt.ProjId,
              name: `Arten (${projekt.AnzAp})`,
              expanded: false,
              children: [0],
              urlPath: [`Projekte`, projekt.ProjId, `Arten`]
            },
            // apberuebersicht folder
            {
              nodeId: `projekt/${projekt.ProjId}/apberuebersicht`,
              folder: `apberuebersicht`,
              table: `projekt`,
              id: projekt.ProjId,
              name: `AP-Berichte (${projekt.AnzApberuebersicht})`,
              expanded: false,
              children: [0],
              urlPath: [`Projekte`, projekt.ProjId, `AP-Berichte`]
            },
          ],
        }
      })
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
