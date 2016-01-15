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
  return data.map(erfkrit => {
    const beurteilText = erfkrit.BeurteilTxt || '(keine Beurteilung)'
    const erfkritText = erfkrit.ErfkritTxt || '(kein Kriterium)'
    const beschriftung = `${beurteilText}: ${erfkritText}`

    return {
      data: beschriftung,
      attr: {
        id: erfkrit.ErfkritId,
        typ: 'erfkrit'
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  connection.query(
    `SELECT ErfkritId, ApArtId, BeurteilTxt, ErfkritTxt, BeurteilOrd FROM erfkrit LEFT JOIN ap_erfkrit_werte ON ErfkritErreichungsgrad = BeurteilId where ApArtId = ${apId} ORDER BY BeurteilOrd`,
    (err, data) => {
      if (err) return reply(err)
      const node = {
        data: `AP-Erfolgskriterien (${data.length})`,
        attr: {
          id: `apOrdnerErfkrit${apId}`,
          typ: 'apOrdnerErfkrit'
        },
        children: buildChildrenFromData(data)
      }

      reply(null, node)
    }
  )
}
