'use strict'

const mysql = require('mysql')
const async = require('async')
const config = require('../../configuration')
const escapeStringForSql = require('../escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

function buildChildForJBer (JBerJahr, jberUebersichtListe) {
  // zuerst den Datensatz extrahieren
  const jberUebersicht = jberUebersichtListe.find(jberUebersicht => jberUebersicht.JbuJahr === JBerJahr)

  if (jberUebersicht) {
    const object = {
      data: 'Übersicht zu allen Arten',
      attr: {
        id: jberUebersicht.JbuJahr,
        typ: 'jberUebersicht'
      }
    }
    return [object]
  }
  return null
}

function buildChildrenForJBerOrdner (results) {
  let childrenArray = []
  let beschriftung = '(kein Jahr)'

  results.jberListe.forEach(jber => {
    if (jber.JBerJahr) beschriftung = jber.JBerJahr.toString()
    const object = {
      data: beschriftung,
      attr: {
        id: jber.JBerId,
        typ: 'jber'
      }
    }
    if (jber.JBerJahr) object.children = buildChildForJBer(jber.JBerJahr, results.jberUebersichtListe)
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  // query ber AND jberUebersicht first
  async.parallel({
    jberListe (callback) {
      connection.query(
        'SELECT JBerId, ApArtId, JBerJahr FROM apber where ApArtId = ' + apId + ' ORDER BY JBerJahr',
        (err, jber) => callback(err, jber)
      )
    },
    jberUebersichtListe (callback) {
      connection.query(
        'SELECT JbuJahr FROM apberuebersicht',
        (err, jberUebersicht) => callback(err, jberUebersicht)
      )
    }
  }, (err, results) => {
    var jberListe = results.jberListe
    var nodeChildren
    var node = {}

    if (err) return reply(err)

    node.data = 'AP-Berichte (' + jberListe.length + ')'
    node.attr = {
      id: 'apOrdnerJber' + apId,
      typ: 'apOrdnerJber'
    }
    nodeChildren = buildChildrenForJBerOrdner(results)
    node.children = nodeChildren

    reply(null, node)
  })
}
