DROP TABLE IF EXISTS beob.adb_eigenschaften;
CREATE TABLE beob.adb_eigenschaften (
  "GUID" UUID PRIMARY KEY,
  "TaxonomieId" integer DEFAULT NULL,
  "Familie" varchar(100) DEFAULT NULL,
  "Artname" varchar(100) DEFAULT NULL,
  "NameDeutsch" varchar(100) DEFAULT NULL,
  "Status" varchar(47) DEFAULT NULL,
  "Artwert" smallint DEFAULT NULL,
  "KefArt" smallint DEFAULT NULL,
  "KefKontrolljahr" smallint DEFAULT NULL,
  "FnsJahresartJahr" smallint DEFAULT NULL
);
CREATE INDEX ON beob.adb_eigenschaften USING btree ("TaxonomieId");
CREATE INDEX ON beob.adb_eigenschaften USING btree ("Artname");

DROP TABLE IF EXISTS beob.adb_lr;
CREATE TABLE beob.adb_lr (
  "Id" integer PRIMARY KEY,
  "LrMethodId" integer DEFAULT NULL,
  "ENr" integer UNIQUE DEFAULT NULL,
  "Label" varchar(50) DEFAULT NULL,
  "Einheit" varchar(255) DEFAULT NULL,
  "ELat" varchar(255) DEFAULT NULL,
  "EEngl" varchar(50) DEFAULT NULL,
  "EFranz" varchar(50) DEFAULT NULL,
  "EItal" varchar(50) DEFAULT NULL,
  "Bemerkungen" text
);
COMMENT ON COLUMN beob.adb_lr."Id" IS 'Primärschlüssel der Tabelle ArtenDb_LR';
CREATE INDEX ON beob.adb_lr USING btree ("LrMethodId");
CREATE INDEX ON beob.adb_lr USING btree ("Id");
CREATE INDEX ON beob.adb_lr USING btree ("Label");
CREATE INDEX ON beob.adb_lr USING btree ("LrMethodId");

--

DROP TABLE IF EXISTS beob.beob;
CREATE TABLE beob.beob (
  id serial PRIMARY KEY,
  "QuelleId" integer Default Null,
  -- this field in data contains this datasets id
  "IdField" varchar(38) DEFAULT NULL,
  -- SISF Nr.
  "ArtId" integer DEFAULT NULL,
  -- wenn kein Monat: Monat = 1
  -- wenn kein Tag: Tag = 1
  "Datum" varchar(10) DEFAULT NULL,
  -- Nachname Vorname
  "Autor" varchar(255) DEFAULT NULL,
  "X" integer DEFAULT NULL,
  "Y" integer DEFAULT NULL,
  data jsonb,
);
CREATE INDEX ON beob.beob USING btree ("QuelleId");
CREATE INDEX ON beob.beob USING btree ("ArtId");
CREATE INDEX ON beob.beob USING btree ("Datum");

DROP TABLER IF EXISTS beob.beob_projekt;
CREATE TABLE beob.beob_projekt (
  "ProjektId" integer,
  "BeobId" integer,
  PRIMARY KEY ("ProjektId", "BeobId")
);

--

DROP TABLE IF EXISTS beob.beob_bereitgestellt;
CREATE TABLE beob.beob_bereitgestellt (
  "BeobId" varchar(38) DEFAULT NULL,
  "NO_NOTE" integer DEFAULT NULL,
  "QuelleId" integer Default Null,
  "NO_NOTE_STRING" varchar(38) DEFAULT NULL,
  "NO_NOTE_PROJET" varchar(38) DEFAULT NULL,
  "NO_ISFS" integer DEFAULT NULL,
  "Datum" varchar(10) DEFAULT NULL,
  "Autor" varchar(255) DEFAULT NULL
);
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("NO_NOTE");
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("NO_NOTE_PROJET");
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("NO_ISFS");
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("Datum");
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("QuelleId");
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("BeobId");

ALTER TABLE beob.beob_bereitgestellt
  ADD COLUMN "QuelleId" integer Default Null;
ALTER TABLE beob.beob_bereitgestellt
  ADD COLUMN "BeobId" varchar(38) Default Null;
CREATE INDEX ON beob.beob_bereitgestellt USING btree ("BeobId");

UPDATE beob.beob_bereitgestellt
SET "BeobId" = "NO_NOTE"
WHERE "NO_NOTE" IS NOT NULL;

UPDATE beob.beob_bereitgestellt
SET "BeobId" = "NO_NOTE_PROJET"
WHERE "NO_NOTE_PROJET" IS NOT NULL;

-- in evab NO_NOTE is a guid
UPDATE beob.beob_bereitgestellt
SET "QuelleId" = 1
WHERE length("BeobId") > 10;

-- in infospezies NO_NOTE is an integer
UPDATE beob.beob_bereitgestellt
SET "QuelleId" = 2
WHERE length("BeobId") < 10;

DROP TABLE IF EXISTS beob.beob_quelle;
CREATE TABLE beob.beob_quelle
(
   "id" integer PRIMARY KEY,
   "name" varchar(255) DEFAULT NULL
);
INSERT INTO beob.beob_quelle VALUES (1, 'evab');
INSERT INTO beob.beob_quelle VALUES (2, 'infospezies');

DROP TABLE IF EXISTS beob.beob_evab;
CREATE TABLE beob.beob_evab (
  "Projekt_ZH" varchar(255) DEFAULT NULL,
  "Raum_ZH" varchar(50) DEFAULT NULL,
  "NO_NOTE_PROJET" varchar(255) DEFAULT NULL,
  "CUSTOM_TEXT_5_" varchar(38) DEFAULT NULL,
  "NO_NOTE" varchar(255) DEFAULT NULL,
  "NO_ISFS" integer DEFAULT NULL,
  "ESPECE" varchar(50) DEFAULT NULL,
  "TY_NOTE" varchar(255) DEFAULT NULL,
  "NOM_PERSONNE_OBS" varchar(50) DEFAULT NULL,
  "PRENOM_PERSONNE_OBS" varchar(50) DEFAULT NULL,
  "PERSONNE_SEC" varchar(200) DEFAULT NULL,
  "J_NOTE" varchar(255) DEFAULT NULL,
  "M_NOTE" varchar(255) DEFAULT NULL,
  "A_NOTE" varchar(255) DEFAULT NULL,
  "ESTIMATION_DATE" varchar(1) DEFAULT NULL,
  "NOM_COMMUNE" varchar(50) DEFAULT NULL,
  "CO_CANTON" varchar(255) DEFAULT NULL,
  "CO_PAYS" varchar(255) DEFAULT NULL,
  "DESC_LOCALITE_" varchar(255) DEFAULT NULL,
  "COORDONNEE_FED_E" integer DEFAULT NULL,
  "COORDONNEE_FED_N" integer DEFAULT NULL,
  "PRECISION_MAILLE" varchar(1) DEFAULT NULL,
  "ALTITUDE_INF" double precision DEFAULT NULL,
  "ALTITUDE_SUP" double precision DEFAULT NULL,
  "PRECISION_ALT" varchar(255) DEFAULT NULL,
  "NOM_ORIGINAL" varchar(130) DEFAULT NULL,
  "REM_NOM" varchar(255) DEFAULT NULL,
  "DETERMINAVIT" varchar(200) DEFAULT NULL,
  "DETERMINAVIT_CF_" varchar(255) DEFAULT NULL,
  "CAT_ABONDANCE" integer DEFAULT NULL,
  "ABONDANCE" varchar(255) DEFAULT NULL,
  "CAT_ABONDANCE_1" integer DEFAULT NULL,
  "TYPE_ABONDANCE_1" varchar(100) DEFAULT NULL,
  "PREC_ABONDANCE_1" varchar(100) DEFAULT NULL,
  "CAT_ABONDANCE_2" integer DEFAULT NULL,
  "TYPE_ABONDANCE_2" varchar(100) DEFAULT NULL,
  "PREC_ABONDANCE_2" varchar(100) DEFAULT NULL,
  "CAT_ABONDANCE_3" integer DEFAULT NULL,
  "TYPE_ABONDANCE_3" varchar(100) DEFAULT NULL,
  "PREC_ABONDANCE_3" varchar(100) DEFAULT NULL,
  "ABS_COUVERTURE" double precision DEFAULT NULL,
  "DeckKlasse" integer DEFAULT NULL,
  "TYPE_COUVERTURE" integer DEFAULT NULL,
  "AGREGATION" varchar(25) DEFAULT NULL,
  "REM_COUVERTURE" varchar(255) DEFAULT NULL,
  "CAT_RECOUVREMENT" varchar(3) DEFAULT NULL,
  "PRESENCE_" varchar(255) DEFAULT NULL,
  "INTRODUIT_" varchar(255) DEFAULT NULL,
  "EXPERTISE_INTRODUIT_" varchar(255) DEFAULT NULL,
  "REM_INTRODUIT" varchar(255) DEFAULT NULL,
  "MENACES" varchar(255) DEFAULT NULL,
  "MESURES" varchar(255) DEFAULT NULL,
  "PHENOLOGIE" varchar(255) DEFAULT NULL,
  "TAILLE_PLANTE" varchar(200) DEFAULT NULL,
  "VITALITE_PLANTE" varchar(200) DEFAULT NULL,
  "STATION" varchar(255) DEFAULT NULL,
  "SUBSTRAT" varchar(255) DEFAULT NULL,
  "SOURCE_BIBLIO" varchar(255) DEFAULT NULL,
  "SOURCE_BIBLIO_CITE" varchar(255) DEFAULT NULL,
  "TY_TEMOIN" varchar(1) DEFAULT NULL,
  "DEPOT_TEMOIN" varchar(255) DEFAULT NULL,
  "ID_TEMOIN" varchar(50) DEFAULT NULL,
  "EX_HERBIER" varchar(255) DEFAULT NULL,
  "NO_SURFACE_WELTEN" double precision DEFAULT NULL,
  "HERBIER_WS" varchar(1) DEFAULT NULL,
  "LUTTE_NEOPHYTES" varchar(1) DEFAULT NULL,
  "LUTTE_DATE" varchar(100) DEFAULT NULL,
  "LUTTE_TYPE" integer DEFAULT NULL,
  "LUTTE_SURFACE" integer DEFAULT NULL,
  "LUTTE_REM" varchar(255) DEFAULT NULL,
  "CUSTOM_NUMBER_1" integer DEFAULT NULL,
  "CUSTOM_NUMBER_2" integer DEFAULT NULL,
  "CUSTOM_NUMBER_3" integer DEFAULT NULL,
  "CUSTOM_NUMBER_4" integer DEFAULT NULL,
  "CUSTOM_NUMBER_5" integer DEFAULT NULL,
  "CUSTOM_TEXT_1" varchar(255) DEFAULT NULL,
  "CUSTOM_TEXT_2" varchar(255) DEFAULT NULL,
  "CUSTOM_TEXT_3" varchar(255) DEFAULT NULL,
  "CUSTOM_TEXT_4" varchar(255) DEFAULT NULL,
  "DEF_CUSTOM" varchar(255) DEFAULT NULL,
  "REM_NOTE" varchar(255) DEFAULT NULL,
  "STRATE_RELEVE" varchar(25) DEFAULT NULL,
  "CO_MILIEU" varchar(9) DEFAULT NULL,
  "CO_MILIEU_2" varchar(255) DEFAULT NULL,
  "CO_MILIEU_3" varchar(255) DEFAULT NULL,
  "ENVIRO_MILIEU" varchar(18) DEFAULT NULL,
  "ENVIRO_MILIEU_2" varchar(10) DEFAULT NULL,
  "ENVIRO_MILIEU_3" varchar(10) DEFAULT NULL,
  "STRUCTURE_MILIEU" integer DEFAULT NULL,
  "STRUCTURE_MILIEU_2" integer DEFAULT NULL,
  "STRUCTURE_MILIEU_3" integer DEFAULT NULL,
  "COUV_ALGUES" varchar(10) DEFAULT NULL,
  "COUV_ARBRES" varchar(10) DEFAULT NULL,
  "COUV_BUISSONS" varchar(10) DEFAULT NULL,
  "COUV_CRYPT" varchar(10) DEFAULT NULL,
  "COUV_EAU" varchar(10) DEFAULT NULL,
  "COUV_HERBACEES" varchar(10) DEFAULT NULL,
  "COUV_LICHENS" varchar(10) DEFAULT NULL,
  "COUV_LITTIERE" varchar(10) DEFAULT NULL,
  "COUV_MOUSSES" varchar(10) DEFAULT NULL,
  "COUV_ROCHE" varchar(10) DEFAULT NULL,
  "COUV_SOLNU" varchar(10) DEFAULT NULL,
  "COUV_TOT" varchar(10) DEFAULT NULL,
  "DEF_COUVERTURE" varchar(255) DEFAULT NULL,
  "HAUTEUR_ARB_MAX" double precision DEFAULT NULL,
  "HAUTEUR_ARB_MIN" double precision DEFAULT NULL,
  "HAUTEUR_ARB_MOY" double precision DEFAULT NULL,
  "HAUTEUR_BUI_MAX" double precision DEFAULT NULL,
  "HAUTEUR_BUI_MIN" double precision DEFAULT NULL,
  "HAUTEUR_BUI_MOY" double precision DEFAULT NULL,
  "HAUTEUR_HERB_MAX" double precision DEFAULT NULL,
  "HAUTEUR_HERB_MIN" double precision DEFAULT NULL,
  "HAUTEUR_HERB_MOY" double precision DEFAULT NULL,
  "HAUTEUR_VEGETATION_MAX" double precision DEFAULT NULL,
  "HAUTEUR_VEGETATION_MIN" double precision DEFAULT NULL,
  "HAUTEUR_VEGETATION_MOY" double precision DEFAULT NULL,
  "HAUTEUR_MOU" double precision DEFAULT NULL,
  "HAUTEUR_LICH" double precision DEFAULT NULL,
  "HAUTEUR_CRYPT" double precision DEFAULT NULL,
  "GEOMORPHOLOGIE" varchar(255) DEFAULT NULL,
  "INCLINAISON" integer DEFAULT NULL,
  "EXPOSITION" varchar(3) DEFAULT NULL,
  "LUMINOSITE" varchar(255) DEFAULT NULL,
  "PH_SOL" varchar(10) DEFAULT NULL,
  "REM_SOL" varchar(255) DEFAULT NULL,
  "DeckKraut" double precision DEFAULT NULL,
  "DeckStrauch" double precision DEFAULT NULL,
  "DeckBaum" double precision DEFAULT NULL
);
CREATE INDEX ON beob.beob_evab USING btree ("NO_NOTE_PROJET");
CREATE INDEX ON beob.beob_evab USING btree ("NO_ISFS");

DROP TABLE IF EXISTS beob.beob_infospezies;
CREATE TABLE beob.beob_infospezies (
  "ID" integer NOT NULL,
  "OBJECTID" integer DEFAULT NULL,
  "FNS_GISLAYER" varchar(255) DEFAULT NULL,
  "FNS_JAHR" integer DEFAULT NULL,
  "FNS_VK" integer DEFAULT NULL,
  "FNS_WFN" integer DEFAULT NULL,
  "FNS_FN" integer DEFAULT NULL,
  "FNS_ARTWERT" integer DEFAULT NULL,
  "FNS_ISFS" integer DEFAULT NULL,
  "FNS_XGIS" integer DEFAULT NULL,
  "FNS_YGIS" integer DEFAULT NULL,
  "NO_NOTE" integer UNIQUE DEFAULT NULL,
  "TY_NOTE" varchar(255) DEFAULT NULL,
  "STATUT_NOTE" varchar(255) DEFAULT NULL,
  "TYPE_RELEVE" varchar(255) DEFAULT NULL,
  "CONFIDENTIALITE" integer DEFAULT NULL,
  "PROJET" varchar(255) DEFAULT NULL,
  "NO_NOTE_PROJET" varchar(255) DEFAULT NULL,
  "NO_ISFS" integer DEFAULT NULL,
  "NOM_COMPLET" varchar(255) DEFAULT NULL,
  "FAMILLE" varchar(255) DEFAULT NULL,
  "GENRE" varchar(255) DEFAULT NULL,
  "NOM_ORIGINAL" varchar(255) DEFAULT NULL,
  "EXPERTISE_NOM" varchar(255) DEFAULT NULL,
  "REM_NOM" varchar(255) DEFAULT NULL,
  "NO_BIBLIO_FLORE" integer DEFAULT NULL,
  "SOURCE_BIBLIO_FLORE" varchar(255) DEFAULT NULL,
  "DETERMINAVIT" varchar(255) DEFAULT NULL,
  "DETERMINAVIT_CF" varchar(255) DEFAULT NULL,
  "PRESENCE" varchar(255) DEFAULT NULL,
  "INDIGENAT" varchar(255) DEFAULT NULL,
  "INTRODUIT" varchar(255) DEFAULT NULL,
  "EXPERTISE_INTRODUIT" varchar(255) DEFAULT NULL,
  "REM_INTRODUIT" varchar(255) DEFAULT NULL,
  "CAT_ABONDANCE" integer DEFAULT NULL,
  "ABONDANCE" varchar(255) DEFAULT NULL,
  "UNITE_COMPTAGE" varchar(255) DEFAULT NULL,
  "NOM_PERSONNE_OBS" varchar(255) DEFAULT NULL,
  "PRENOM_PERSONNE_OBS" varchar(255) DEFAULT NULL,
  "PERSONNE_SEC" varchar(255) DEFAULT NULL,
  "J_NOTE" integer DEFAULT NULL,
  "M_NOTE" integer DEFAULT NULL,
  "A_NOTE" integer DEFAULT NULL,
  "EXPERTISE_DATE" varchar(255) DEFAULT NULL,
  "CO_CANTON" varchar(255) DEFAULT NULL,
  "NOM_COMMUNE" varchar(255) DEFAULT NULL,
  "EXPERTISE_COMMUNE" varchar(255) DEFAULT NULL,
  "DESC_LOCALITE" varchar(255) DEFAULT NULL,
  "XY_FORME" varchar(255) DEFAULT NULL,
  "XY_PRECISION" varchar(255) DEFAULT NULL,
  "EXPERTISE_GEO" varchar(255) DEFAULT NULL,
  "ALTITUDE_INF" varchar(255) DEFAULT NULL,
  "ALTITUDE_SUP" integer DEFAULT NULL,
  "EXPERTISE_ALTITUDE" varchar(255) DEFAULT NULL,
  "NO_SURFACE_WELTEN" varchar(255) DEFAULT NULL,
  "EXPERTISE_WS" varchar(255) DEFAULT NULL,
  "STATION" varchar(255) DEFAULT NULL,
  "SUBSTRAT" varchar(255) DEFAULT NULL,
  "CO_MILIEU" varchar(255) DEFAULT NULL,
  "REM_NOTE" varchar(255) DEFAULT NULL,
  "REM_PROJET" varchar(255) DEFAULT NULL,
  "MENACES" varchar(255) DEFAULT NULL,
  "MESURES" varchar(255) DEFAULT NULL,
  "TY_TEMOIN" varchar(255) DEFAULT NULL,
  "DEPOT_TEMOIN" varchar(255) DEFAULT NULL,
  "ID_TEMOIN" varchar(255) DEFAULT NULL,
  "EX_HERBIER" varchar(255) DEFAULT NULL,
  "NO_BIBLIO" varchar(255) DEFAULT NULL,
  "SOURCE_BIBLIO" varchar(255) DEFAULT NULL,
  "NO_BIBLIO_CITE" varchar(255) DEFAULT NULL,
  "ESTIMATION_DATE" varchar(255) DEFAULT NULL,
  "PRECISION_MAILLE" varchar(255) DEFAULT NULL,
  "ZDSF_KATEGORIE" varchar(255) DEFAULT NULL,
  "ZH_GUID" varchar(255) DEFAULT NULL,
  "ZH_PROJEKTNAME" varchar(255) DEFAULT NULL
);
CREATE INDEX ON beob.beob_infospezies USING btree ("ID");
CREATE INDEX ON beob.beob_infospezies USING btree ("NO_ISFS");
CREATE INDEX ON beob.beob_infospezies USING btree ("NO_NOTE");

DROP TABLE IF EXISTS beob.evab_tbl_personen;
CREATE TABLE beob.evab_tbl_personen (
  "idPerson" varchar(40) PRIMARY KEY,
  "Name" varchar(50) NOT NULL,
  "Vorname" varchar(50) NOT NULL,
  "Ort" varchar(50) NOT NULL
);

DROP TABLE IF EXISTS beob.flora_status_werte;
CREATE TABLE beob.flora_status_werte (
  "StatusWert" varchar(2) PRIMARY KEY,
  "StatusText" text NOT NULL
);
