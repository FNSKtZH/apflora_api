Bereitgestellte Beobachtungen löschen:
DELETE FROM beob_bereitgestellt

Feldliste holen:
SELECT attname
FROM   pg_attribute
WHERE  attrelid = 'beob.beob_infospezies'::regclass
AND    attnum > 0
AND    NOT attisdropped
ORDER  BY attnum;

Beobachtungen von Info Spezies bereitstellen:
INSERT INTO beob.beob (
  "QuelleId",
  "IdField",
  "ArtId",
  "Datum",
  "Autor",
  "X",
  "Y",
  "data"
)
SELECT
  '2',
  'NO_NOTE',
  "NO_ISFS",
  -- build a Date of the form DD.MM.YYYY
  CASE
  WHEN "M_NOTE" IS NULL THEN to_date("A_NOTE"::text || '-00-00', 'YYYY-MM-DD')
  ELSE
    CASE WHEN "J_NOTE" IS NULL
    THEN to_date(CONCAT(
      "A_NOTE"::text,
      '-',
      CASE WHEN char_length("M_NOTE"::text) = 2
      THEN "M_NOTE"::text
      ELSE '0' || "M_NOTE"::text
      END,
      '-00'
    ), 'YYYY-MM-DD')
    ELSE to_date(CONCAT(
      "A_NOTE"::text,
      '-',
      CASE WHEN char_length("M_NOTE"::text) = 2
      THEN "M_NOTE"::text
      ELSE '0' || "M_NOTE"::text
      END,
      '-',
      CASE WHEN char_length("J_NOTE"::text) = 2
      THEN "J_NOTE"::text
      ELSE '0' || "J_NOTE"::text
      END
    ), 'YYYY-MM-DD')
    END
  END,
  CASE WHEN "PRENOM_PERSONNE_OBS" IS NULL
  THEN "NOM_PERSONNE_OBS"
  ELSE "PRENOM_PERSONNE_OBS" || ' ' || "NOM_PERSONNE_OBS"
  END,
  "FNS_XGIS",
  "FNS_YGIS",
  row_to_json(
    (
      SELECT d FROM (
        SELECT "ID", "OBJECTID", "FNS_GISLAYER", "FNS_JAHR", "FNS_VK", "FNS_WFN", "FNS_FN", "FNS_ARTWERT", "FNS_ISFS", "FNS_XGIS", "FNS_YGIS", "NO_NOTE", "TY_NOTE", "STATUT_NOTE", "TYPE_RELEVE", "CONFIDENTIALITE", "PROJET", "NO_NOTE_PROJET", "NO_ISFS", "NOM_COMPLET", "FAMILLE", "GENRE", "NOM_ORIGINAL", "EXPERTISE_NOM", "REM_NOM", "NO_BIBLIO_FLORE", "SOURCE_BIBLIO_FLORE", "DETERMINAVIT", "DETERMINAVIT_CF", "PRESENCE", "INDIGENAT", "INTRODUIT", "EXPERTISE_INTRODUIT", "REM_INTRODUIT", "CAT_ABONDANCE", "ABONDANCE", "UNITE_COMPTAGE", "NOM_PERSONNE_OBS", "PRENOM_PERSONNE_OBS", "PERSONNE_SEC", "J_NOTE", "M_NOTE", "A_NOTE", "EXPERTISE_DATE", "CO_CANTON", "NOM_COMMUNE", "EXPERTISE_COMMUNE", "DESC_LOCALITE", "XY_FORME", "XY_PRECISION", "EXPERTISE_GEO", "ALTITUDE_INF", "ALTITUDE_SUP", "EXPERTISE_ALTITUDE", "NO_SURFACE_WELTEN", "EXPERTISE_WS", "STATION", "SUBSTRAT", "CO_MILIEU", "REM_NOTE", "REM_PROJET", "MENACES", "MESURES", "TY_TEMOIN", "DEPOT_TEMOIN", "ID_TEMOIN", "EX_HERBIER", "NO_BIBLIO", "SOURCE_BIBLIO", "NO_BIBLIO_CITE", "ESTIMATION_DATE", "PRECISION_MAILLE", "ZDSF_KATEGORIE", "ZH_GUID", "ZH_PROJEKTNAME"
      )
    d)
  ) AS data
FROM beob.beob_infospezies
WHERE
  -- exclude beob that were exported from EvAB
  "ZH_GUID" IS NULL AND
  -- exclude beob that have no year
  "A_NOTE" IS NOT NULL AND
  -- exclude data without coordinates
  "FNS_XGIS" IS NOT NULL AND
  "FNS_YGIS" IS NOT NULL;

Beobachtungen von EvAB bereitstellen:
INSERT INTO beob.beob (NO_NOTE_PROJET, NO_ISFS, Datum, Autor) SELECT NO_NOTE_PROJET, NO_ISFS, IF(M_NOTE IS NULL, A_NOTE, IF(J_NOTE IS NULL, CONCAT(A_NOTE, '.', IF(M_NOTE>0, IF(char_length(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), NULL)), CONCAT(A_NOTE, '.', IF(M_NOTE>0, IF(char_length(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), NULL), '.', IF(J_NOTE>0, IF(char_length(J_NOTE) = 2, J_NOTE, CONCAT("0", J_NOTE)), NULL)))), IF(PRENOM_PERSONNE_OBS IS NULL, NOM_PERSONNE_OBS, CONCAT(PRENOM_PERSONNE_OBS, " ", NOM_PERSONNE_OBS)) FROM beob_evab;

Dabei wurden ersetzt:
M_NOTE mit: IF(M_NOTE>0, IF(char_length(M_NOTE) = 2, M_NOTE, CONCAT("0", M_NOTE)), NULL)
J_NOTE mit: IF(J_NOTE>0, IF(char_length(J_NOTE) = 2, J_NOTE, CONCAT("0", J_NOTE)), NULL)
weil die Felder statt Nullwerten eine 0 enthalten!

Beispielsabfrage:
SELECT Datum, Autor FROM beob.beob WHERE NO_ISFS=100 ORDER BY Datum
