'use strict'

const mysql = require('mysql')
const config = require('../../configuration')
const escapeStringForSql = require('../escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

function buildChildrenFromData (data) {
  return data.map(assArt => {
    return {
      data: assArt.Artname || '(keine Art gewählt)',
      attr: {
        id: assArt.AaId,
        typ: 'assozarten'
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  connection.query(
    `SELECT AaId, beob.adb_eigenschaften.Artname FROM assozart LEFT JOIN beob.adb_eigenschaften ON AaSisfNr = beob.adb_eigenschaften.TaxonomieId where AaApArtId = ${apId} ORDER BY beob.adb_eigenschaften.Artname`,
    (err, data) => {
      if (err) return reply(err)
      const response = {
        data: 'assoziierte Arten (' + data.length + ')',
        attr: {
          id: 'apOrdnerAssozarten' + apId,
          typ: 'apOrdnerAssozarten'
        },
        children: buildChildrenFromData(data)
      }
      reply(null, response)
    }
  )
}
