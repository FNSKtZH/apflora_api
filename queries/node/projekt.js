'use strict'
/* eslint-disable no-console */

const parallel = require('async/parallel')
const rootNode = require('../../src/rootNode')

// TODO: get real user

module.exports = (request, callback) => {
  const id = encodeURIComponent(request.params.id)
  const user = 23

  parallel({
    projektListe(cb) {
      const sql = `
        SELECT
          "ProjId",
          "ProjName"
        FROM
          apflora.projekt
        WHERE
          "ProjId" IN (
            SELECT
              "ProjId"
            FROM
              apflora.userprojekt
            WHERE
              "UserId" = ${user}
          )
        ORDER BY
          "ProjName"
        `
      request.pg.client.query(sql, (error, result) => {
        const nodes = result.rows.map(projekt => ({
          nodeId: `projekt/${projekt.ProjId}`,
          datasetId: projekt.ProjId,
          type: 'dataset',
          name: projekt.ProjName,
          expanded: id && id === projekt.ProjId,
          nrOfUnloadedChildren: 'todo',
        }))
        cb(error, nodes)
      })
    },
    anzApListe(cb) {
      const sql = `
        SELECT
          "ProjId",
          COUNT("ApArtId")::int AS "anzAp"
        FROM
          apflora.ap
        GROUP BY
          "ProjId"
        `
      request.pg.client.query(sql, (error, result) =>
        cb(error, result.rows)
      )
    },
  }, (err, results) => {
    if (err) return callback(err, null)

    const projektListe = results.projektListe || []
    const anzApListe = results.anzApListe

    projektListe.forEach((node) => {
      const nrOfChildrenRow = anzApListe.find(el => el.ProjId === node.datasetId)
      const nrOfChildren = nrOfChildrenRow.anzAp || 0
      node.nrOfUnloadedChildren = nrOfChildren
    })

    projektListe.unshift(rootNode)

    callback(null, projektListe)
  })
}
