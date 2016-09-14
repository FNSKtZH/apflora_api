'use strict'

const app = require('ampersand-app')
const rootNode = require('../../src/rootNode')

// TODO: get real user

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.params.table)
  const levels = encodeURIComponent(request.params.levels)
  const user = 23

  // TODO: distribute to separate functions

  const getProjektNodes = app.db.many(sqlProjListe, user)
    .then((projects) => {
      const nodes = projects.map(projekt => ({
        nodeId: `projekt/${projekt.ProjId}`,
        datasetId: projekt.ProjId,
        type: 'dataset',
        name: projekt.ProjName,
        expanded: id && id === projekt.ProjId,
        nrOfUnloadedChildren: 'todo',
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
      if (levels === 'all') {
        projektNodes.unshift(rootNode)
      }
      callback(null, projektNodes)
    })
}
