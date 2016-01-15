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

const buildChildrenFromData = (data) => {
  return data.map(ber => {
    const berjahrText = ber.BerJahr || '(kein Jahr)'
    const bertitelText = ber.BerTitel || '(kein Titel)'
    const beschriftung = `${berjahrText}: ${bertitelText}`

    return {
      data: beschriftung,
      attr: {
        id: ber.BerId,
        typ: 'ber'
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  connection.query(
    `SELECT BerId, ApArtId, BerJahr, BerTitel FROM ber where ApArtId = ${apId} ORDER BY BerJahr DESC, BerTitel`,
    (err, data) => {
      if (err) return reply(err)

      const node = {
        data: `Berichte (${data.length})`,
        attr: {
          id: `apOrdnerBer${apId}`,
          typ: 'apOrdnerBer'
        },
        children: buildChildrenFromData(data)
      }

      reply(null, node)
    }
  )
}
