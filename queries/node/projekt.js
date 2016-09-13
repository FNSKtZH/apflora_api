'use strict'

const parallel = require('async/parallel')

// TODO: get real user

module.exports = (request, callback) => {
  const { table, id } = request.params
  const user = 23

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
      request.pg.client.query(sql, (error, result) => {
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
    },
  }, (err, results) => {
    if (err) return reply(err)

    const projektListe = results.projektListe || []
    const anzApListe = results.anzApListe || []

  })
}
