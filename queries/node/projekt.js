'use strict'

const app = require(`ampersand-app`)
const rootNode = require(`../../src/rootNode`)

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
  let id = encodeURIComponent(request.query.id)
  const levels = encodeURIComponent(request.query.levels)
  const user = 23

  if (id) {
    id = parseInt(id, 0)
  }

  const getProjektNodes = app.db.many(sqlProjListe, user)
    .then((projects) => {
      const nodes = projects.map(projekt => ({
        nodeId: `projekt/${projekt.ProjId}`,
        datasetId: projekt.ProjId,
        type: `dataset`,
        name: projekt.ProjName,
        expanded: id && id === projekt.ProjId ? true : false,  // eslint-disable-line no-unneeded-ternary
        nrOfUnloadedChildren: `todo`,
        parentId: `root`,
      }))
      return nodes
    })
    .catch((error) => {
      throw error
    })
  const getAnzApListe = app.db.many(sqlAnzApListe)
    .then(anzApListe =>
      anzApListe || []
    )
    .catch((error) => {
      throw error
    })

  Promise.all([getProjektNodes, getAnzApListe])
    .then(([projektNodes, anzApListe]) => {
      projektNodes.forEach((node) => {
        const nrOfChildrenRow = anzApListe.find(el => el.ProjId === node.datasetId)
        const nrOfChildren = nrOfChildrenRow.anzAp || 0
        node.nrOfUnloadedChildren = nrOfChildren
      })
      if (levels === `all`) {
        const projektNodesIds = projektNodes.map(node => node.nodeId)
        rootNode.children = projektNodesIds
        projektNodes.unshift(rootNode)
      }
      callback(null, projektNodes)
    })
}
