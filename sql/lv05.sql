-- TPOP
-- clear bad data
SELECT
  "TPopXKoord",
  "TPopYKoord"
FROM
 apflora.tpop
WHERE
  ("TPopXKoord" IS NOT NULL AND "TPopYKoord" IS NULL)
  OR ("TPopYKoord" IS NOT NULL AND "TPopXKoord" IS NULL);

-- correct bad data
UPDATE
  apflora.tpop
SET
  "TPopXKoord" = NULL
WHERE
  "TPopXKoord" IS NOT NULL AND "TPopYKoord" IS NULL;

UPDATE
  apflora.tpop
SET
  "TPopYKoord" = NULL
WHERE
  "TPopYKoord" IS NOT NULL AND "TPopXKoord" IS NULL;

-- select data
SELECT
  "TPopXKoord",
  "TPopYKoord"
FROM
 apflora.tpop
WHERE
  "TPopXKoord" IS NOT NULL
  AND "TPopYKoord" IS NOT NULL;


-- POP
-- clear bad data
SELECT
  "PopXKoord",
  "PopYKoord"
FROM
 apflora.pop
WHERE
  ("PopXKoord" IS NOT NULL AND "PopYKoord" IS NULL)
  OR ("PopYKoord" IS NOT NULL AND "PopXKoord" IS NULL);

-- correct bad data
UPDATE
  apflora.pop
SET
  "PopXKoord" = NULL
WHERE
  "PopXKoord" IS NOT NULL AND "PopYKoord" IS NULL;

UPDATE
  apflora.pop
SET
  "PopYKoord" = NULL
WHERE
  "PopYKoord" IS NOT NULL AND "PopXKoord" IS NULL;

-- select data
SELECT
  "PopXKoord",
  "PopYKoord"
FROM
 apflora.pop
WHERE
  "PopXKoord" IS NOT NULL
  AND "PopYKoord" IS NOT NULL;
