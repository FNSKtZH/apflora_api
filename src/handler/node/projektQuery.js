'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const apFolderQuery = require(`./apFolderQuery`)
const apberuebersichtFolderQuery = require(`./apberuebersichtFolderQuery`)

module.exports = ({ user, projId, children }) =>
  app.db.task(function* getData() {
    let apFolder = []
    let apberuebersichtFolder = []

    if (children.includes(`apFolder`)) {
      apFolder = yield apFolderQuery(projId, children)
    }
    if (children.includes(`apberuebersichtFolder`)) {
      apberuebersichtFolder = yield apberuebersichtFolderQuery(projId)
    }
    const projektListe = yield app.db.any(`
      SELECT
        apflora.projekt.*,
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
    return projektListe.map((row) => {
      const idActive = !!projId && projId === row.ProjId
      // const oneProject = projektListe.length === 1  // temporarily disabled
      return {
        nodeId: `projekt/${row.ProjId}`,
        table: `projekt`,
        row,
        expanded: idActive, // || oneProject,  // temporarily disabled
        urlPath: [`Projekte`, row.ProjId],
        nodeIdPath: [`projekt/${row.ProjId}`],
        children: [
          // ap folder
          {
            nodeId: `projekt/${row.ProjId}/ap`,
            folder: `ap`,
            table: `projekt`,
            id: row.ProjId,
            folderLabel: `Arten (${row.AnzAp})`,
            expanded: false,
            children: apFolder.length === 0 ? _.times(row.AnzAp, _.constant(0)) : apFolder,
            urlPath: [`Projekte`, row.ProjId, `Arten`],
            nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`],
          },
          // apberuebersicht folder
          {
            nodeId: `projekt/${row.ProjId}/apberuebersicht`,
            folder: `apberuebersicht`,
            table: `projekt`,
            id: row.ProjId,
            folderLabel: `AP-Berichte (${row.AnzApberuebersicht})`,
            expanded: false,
            children: (
              apberuebersichtFolder.length === 0 ?
              _.times(row.AnzApberuebersicht, _.constant(0)) :
              apberuebersichtFolder
            ),
            urlPath: [`Projekte`, row.ProjId, `AP-Berichte`],
            nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/apberuebersicht`],
          },
        ],
      }
    })
  })
    .then(nodes => nodes)
    .catch((error) => { throw error })
