'use strict'

const parallel = require('async/parallel')
const rootNode = require('../../src/rootNode')

// TODO: get real user

module.exports = (request, callback) => {
  const { table, id } = request.params
  const user = 23

  console.log('hello from handler')
  console.log('parallel:', parallel)

  parallel({
    projektListe (callback) {
      const sql = `
        SELECT
          "ProjId" AS id,
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
      console.log('sql:', sql)
      request.pg.client.query(sql, (error, result) => {
        console.log('result.rows:', result.rows)
        // prepare data
        const nodes = result.rows.map((projekt) => ({
          nodeId: `projekt/${projekt.ProjId}`,
          datasetId: projekt.ProjId,
          type: 'dataset',
          name: projekt.ProjName,
          expanded: id && id === projekt.ProjId,
          nrOfUnloadedChildren: 'todo',
        }))
        callback(error, nodes)
      })
    },
    anzApListe (callback) {
      const sql = `
        SELECT
          "ProjId",
          COUNT("ApArtId") AS "anzAp"
        FROM
          apflora.ap
        GROUP BY
          "ProjId"
        `
    },
  }, (err, results) => {
    if (err) return reply(err)

    const projektListe = results.projektListe || []
    const anzApListe = results.anzApListe

    console.log('projektListe:', projektListe)
    console.log('anzApListe:', anzApListe)

    projektListe.forEach((node) => {
      const nrOfChildrenRow = anzApListe.find((el) => el.ProjId === node.nodeId)
      const nrOfChildren = nrOfChildrenRow.anzAp || 0
      node.nrOfUnloadedChildren = nrOfChildren
    })

    projektListe.push(rootNode)

    callback(error, projektListe)

  })
}
