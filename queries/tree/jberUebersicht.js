'use strict'

var mysql = require('mysql')
var config = require('../../configuration')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (JBerJahr) {
  connection.query(
    'SELECT JbuJahr FROM apberuebersicht WHERE JbuJahr=' + JBerJahr,
    function (err, data) {
      var node = {}
      var nodeArray = []

      if (err) { throw err }

      if (data && data[0]) {
        data = data[0]
        node.data = 'Übersicht zu allen Arten'
        node.attr = {
          id: data.JbuJahr,
          typ: 'jberUebersicht'
        }
        nodeArray.push(node)
        return nodeArray
      }
      return null
    }
  )
}
