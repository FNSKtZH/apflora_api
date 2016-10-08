'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    beob.beob_evab."NO_NOTE_PROJET",
    beob.beob_evab."NO_ISFS",
    apflora.tpop."TPopId",
    beob.beob_evab."COORDONNEE_FED_E",
    beob.beob_evab."COORDONNEE_FED_N",
    apflora.tpop."TPopXKoord",
    apflora.tpop."TPopYKoord",
    apflora.pop."PopNr",
    apflora.tpop."TPopNr",
    apflora.tpop."TPopFlurname",
    sqrt(
      power(beob.beob_evab."COORDONNEE_FED_E" - apflora.tpop."TPopXKoord", 2) +
      power(beob.beob_evab."COORDONNEE_FED_N" - apflora.tpop."TPopYKoord", 2)
    ) AS "DistZuTPop"
  FROM
    beob.beob_evab
    INNER JOIN
      (apflora.pop
        INNER JOIN
          apflora.tpop
          ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON beob.beob_evab."NO_ISFS" = apflora.pop."ApArtId"
  WHERE
    beob.beob_evab."NO_NOTE_PROJET" = $1
    AND apflora.tpop."TPopXKoord" IS NOT NULL
    AND apflora.tpop."TPopYKoord" IS NOT NULL
    AND beob.beob_evab."COORDONNEE_FED_E" IS NOT NULL
    AND beob.beob_evab."COORDONNEE_FED_N" IS NOT NULL
  ORDER BY
    "DistZuTPop",
    apflora.tpop."TPopFlurname"`

module.exports = (request, callback) => {
  const beobId = encodeURIComponent(request.params.beobId)
  app.db.any(sql, beobId)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
