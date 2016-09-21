'use strict'

const escapeStringForSql = require(`../escapeStringForSql`)

const buildChildrenFromData = (data) => {
  return data.map((erfkrit) => {
    const beurteilText = erfkrit.BeurteilTxt || `(keine Beurteilung)`
    const erfkritText = erfkrit.ErfkritTxt || `(kein Kriterium)`
    const beschriftung = `${beurteilText}: ${erfkritText}`

    return {
      data: beschriftung,
      attr: {
        id: erfkrit.ErfkritId,
        typ: `erfkrit`
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  request.pg.client.query(
    `SELECT
      "ErfkritId",
      "ApArtId",
      "BeurteilTxt",
      "ErfkritTxt",
      "BeurteilOrd"
    FROM
      apflora.erfkrit
      LEFT JOIN
        apflora.ap_erfkrit_werte
        ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
    WHERE
      "ApArtId" = ${apId}
    ORDER BY
      "BeurteilOrd"`,
    (err, result) => {
      if (err) return reply(err)
      const data = result.rows
      const node = {
        data: `AP-Erfolgskriterien (${data.length})`,
        attr: {
          id: `apOrdnerErfkrit${apId}`,
          typ: `apOrdnerErfkrit`
        },
        children: buildChildrenFromData(data)
      }

      reply(null, node)
    }
  )
}
