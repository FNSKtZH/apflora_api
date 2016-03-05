'use strict'

const escapeStringForSql = require('../escapeStringForSql')

const buildChildrenFromData = (data) => {
  return data.map((ber) => {
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

  request.pg.client.query(
    `SELECT
      "BerId",
      "ApArtId",
      "BerJahr",
      "BerTitel"
    FROM
      apflora.ber
    WHERE
      "ApArtId" = ${apId}
    ORDER BY
      "BerJahr" DESC,
      "BerTitel"`,
    (err, result) => {
      if (err) return reply(err)
      const data = result.rows

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
