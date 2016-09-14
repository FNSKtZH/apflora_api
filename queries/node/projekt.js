'use strict'
/* eslint-disable no-console */

const app = require('ampersand-app')
const parallel = require('async/parallel')
const rootNode = require('../../src/rootNode')

const sqlProjListe = `
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
        "UserId" = $1
    )
  ORDER BY
    "ProjName"
  `
const sqlAnzApListe = `
  SELECT
    "ProjId",
    COUNT("ApArtId")::int AS "anzAp"
  FROM
    apflora.ap
  GROUP BY
    "ProjId"
  `

// TODO: get real user

module.exports = (request, callback) => {
  const id = encodeURIComponent(request.params.id)
  const user = 23

  // const projektListe = 

  parallel({
    projektListe(cb) {
      app.db.many(sqlProjListe, user)
        .then((projects) => {
          const nodes = projects.map(projekt => ({
            nodeId: `projekt/${projekt.ProjId}`,
            datasetId: projekt.ProjId,
            type: 'dataset',
            name: projekt.ProjName,
            expanded: id && id === projekt.ProjId,
            nrOfUnloadedChildren: 'todo',
          }))
          cb(null, nodes)
        })
        .catch(error => cb(error, null))
    },
    anzApListe(cb) {
      app.db.many(sqlAnzApListe)
        .then(apListe => cb(null, apListe))
        .catch(error => cb(error, null))
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
