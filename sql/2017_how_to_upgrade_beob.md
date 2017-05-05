
- create table beob.beob, using create_tables_beob
- add its data using 2017_beob_insert
- alter table apflora.beobzuordnung to include BeobId
  ```sql
  ALTER TABLE apflora.beobzuordnung ADD COLUMN "BeobId" integer;
  ```
- update data in apflora.beobzuordnung using 2017_update_beobzuordnung.sql
- alter table apflora.beobzuordnung to make BeobId primary key
  ```sql
  ALTER TABLE apflora.beobzuordnung ADD PRIMARY KEY ("BeobId");
  ```
  but first check data:
  ```sql
  -- oops:
  SELECT count("BeobId") AS "anz_beob", "BeobId" from apflora.beobzuordnung
  GROUP BY "BeobId"
  HAVING count("BeobId") > 1
  ORDER BY "anz_beob" desc

  DELETE FROM apflora.beobzuordnung WHERE "BeobId" IN (
    SELECT "BeobId" from apflora.beobzuordnung
    GROUP BY "BeobId"
    HAVING count("BeobId") > 1
  )

  -- oops:
  SELECT count("BeobId") AS "anz_beob", "BeobId" from apflora.beobzuordnung
  GROUP BY "BeobId"
  HAVING count("BeobId") = 0
  ORDER BY "anz_beob" desc
  ```
