-- select original id
SELECT
  beob.id,
  beob."IdField",
  beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) AS "OriginalId"
FROM
  beob.beob
  INNER JOIN beob.beob AS beob2
  ON beob2.id = beob.id
LIMIT 10

CREATE INDEX ON beob.beob((data->>'NO_NOTE'));
CREATE INDEX ON beob.beob((data->>'NO_NOTE_PROJET'));

-- update beobid in beobzuordnung
-- this query took 2.46 hours!
UPDATE apflora.beobzuordnung
SET "BeobId" = (
  SELECT
    beob.id
  FROM
    beob.beob
    INNER JOIN beob.beob AS beob2
    ON beob2.id = beob.id
  WHERE
    beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) = apflora.beobzuordnung."NO_NOTE"
)

-- check result
SELECT
  beobzuordnung."BeobId",
  beobzuordnung."NO_NOTE",
  beob.id,
  beob."QuelleId",
  beob.data->>(SELECT "IdField" FROM beob.beob WHERE id = beob2.id) AS "OriginalId"
FROM
  apflora.beobzuordnung
  LEFT JOIN beob.beob
    INNER JOIN beob.beob AS beob2
    ON beob2.id = beob.id
  ON apflora.beobzuordnung."BeobId" = beob.beob.id
WHERE beob."QuelleId" = 1
LIMIT 10
