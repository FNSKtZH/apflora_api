/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */

DROP VIEW IF EXISTS views.v_ap_massnjahre CASCADE;
CREATE OR REPLACE VIEW views.v_ap_massnjahre AS
SELECT
  apflora.ap."ApArtId",
  views.v_massn_jahre."TPopMassnJahr"
FROM
  apflora.ap,
  views.v_massn_jahre
WHERE
  apflora.ap."ApArtId" > 0
  AND apflora.ap."ApStatus" < 4
ORDER BY
  apflora.ap."ApArtId",
  views.v_massn_jahre."TPopMassnJahr";

DROP VIEW IF EXISTS views.v_ap_anzmassnprojahr CASCADE;
CREATE OR REPLACE VIEW views.v_ap_anzmassnprojahr AS
SELECT
  views.v_ap_massnjahre."ApArtId",
  views.v_ap_massnjahre."TPopMassnJahr",
  COALESCE(views.v_ap_anzmassnprojahr0."AnzahlvonTPopMassnId", 0) AS "AnzahlMassnahmen"
FROM
  views.v_ap_massnjahre
  LEFT JOIN
    views.v_ap_anzmassnprojahr0
    ON
      (views.v_ap_massnjahre."TPopMassnJahr" = views.v_ap_anzmassnprojahr0."TPopMassnJahr")
      AND (views.v_ap_massnjahre."ApArtId" = views.v_ap_anzmassnprojahr0."ApArtId")
ORDER BY
  views.v_ap_massnjahre."ApArtId",
  views.v_ap_massnjahre."TPopMassnJahr";

DROP VIEW IF EXISTS views.v_ap_anzmassnbisjahr CASCADE;
CREATE OR REPLACE VIEW views.v_ap_anzmassnbisjahr AS
SELECT
  views.v_ap_massnjahre."ApArtId",
  views.v_ap_massnjahre."TPopMassnJahr",
  sum(views.v_ap_anzmassnprojahr."AnzahlMassnahmen") AS "AnzahlMassnahmen"
FROM
  views.v_ap_massnjahre
  INNER JOIN
    views.v_ap_anzmassnprojahr
    ON views.v_ap_massnjahre."ApArtId" = views.v_ap_anzmassnprojahr."ApArtId"
WHERE
  views.v_ap_anzmassnprojahr."TPopMassnJahr" <= views.v_ap_massnjahre."TPopMassnJahr"
GROUP BY
  views.v_ap_massnjahre."ApArtId",
  views.v_ap_massnjahre."TPopMassnJahr"
ORDER BY
  views.v_ap_massnjahre."ApArtId",
  views.v_ap_massnjahre."TPopMassnJahr";

DROP VIEW IF EXISTS views.v_ap_apberundmassn CASCADE;
CREATE OR REPLACE VIEW views.v_ap_apberundmassn AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.adresse."AdrName" AS "AP Verantwortlich",
  apflora.ap."ApArtwert" AS "Artwert",
  views.v_ap_anzmassnprojahr."TPopMassnJahr" AS "Jahr",
  views.v_ap_anzmassnprojahr."AnzahlMassnahmen" AS "Anzahl Massnahmen",
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" AS "Anzahl Massnahmen bisher",
  CASE
    WHEN apflora.apber."JBerJahr" > 0
    THEN 'Ja'
    ELSE 'Nein'
  END AS "Bericht erstellt"
FROM
  beob.adb_eigenschaften
    INNER JOIN
      ((((apflora.ap
      LEFT JOIN
        apflora.ap_bearbstand_werte
        ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
      LEFT JOIN
        apflora.adresse
        ON apflora.ap."ApBearb" = apflora.adresse."AdrId")
      INNER JOIN
        (views.v_ap_anzmassnprojahr
        INNER JOIN
          (views.v_ap_anzmassnbisjahr
          LEFT JOIN
            apflora.apber
            ON
              (views.v_ap_anzmassnbisjahr."TPopMassnJahr" = apflora.apber."JBerJahr")
              AND (views.v_ap_anzmassnbisjahr."ApArtId" = apflora.apber."ApArtId"))
          ON
            (views.v_ap_anzmassnprojahr."TPopMassnJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr")
            AND (views.v_ap_anzmassnprojahr."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId"))
        ON apflora.ap."ApArtId" = views.v_ap_anzmassnprojahr."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  views.v_ap_anzmassnprojahr."TPopMassnJahr";

DROP VIEW IF EXISTS views.v_tpop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW views.v_tpop_letztermassnber AS
SELECT
  views.v_tpop_letztermassnber0."ApArtId",
  views.v_tpop_letztermassnber0."TPopId",
  max(views.v_tpop_letztermassnber0."TPopMassnBerJahr") AS "MaxvonTPopMassnBerJahr"
FROM
  views.v_tpop_letztermassnber0
GROUP BY
  views.v_tpop_letztermassnber0."ApArtId",
  views.v_tpop_letztermassnber0."TPopId";

DROP VIEW IF EXISTS views.v_tpop_letztertpopber CASCADE;
CREATE OR REPLACE VIEW views.v_tpop_letztertpopber AS
SELECT
  views.v_tpop_letztertpopber0."ApArtId",
  views.v_tpop_letztertpopber0."TPopId",
  max(views.v_tpop_letztertpopber0."TPopBerJahr") AS "MaxvonTPopBerJahr"
FROM
  views.v_tpop_letztertpopber0
GROUP BY
  views.v_tpop_letztertpopber0."ApArtId",
  views.v_tpop_letztertpopber0."TPopId";

DROP VIEW IF EXISTS views.v_pop_letztermassnber CASCADE;
CREATE OR REPLACE VIEW views.v_pop_letztermassnber AS
SELECT
  views.v_pop_letztermassnber0."ApArtId",
  views.v_pop_letztermassnber0."PopId",
  max(views.v_pop_letztermassnber0."PopMassnBerJahr") AS "MaxvonPopMassnBerJahr"
FROM
  views.v_pop_letztermassnber0
GROUP BY
  views.v_pop_letztermassnber0."ApArtId",
  views.v_pop_letztermassnber0."PopId";

-- dieser view ist für den Bericht gedacht - daher letzter popber vor jBerJahr
DROP VIEW IF EXISTS views.v_pop_letzterpopber CASCADE;
CREATE OR REPLACE VIEW views.v_pop_letzterpopber AS
SELECT
  views.v_pop_letzterpopber0."ApArtId",
  views.v_pop_letzterpopber0."PopId",
  max(views.v_pop_letzterpopber0."PopBerJahr") AS "MaxvonPopBerJahr"
FROM
  views.v_pop_letzterpopber0
GROUP BY
  views.v_pop_letzterpopber0."ApArtId",
  views.v_pop_letzterpopber0."PopId";

-- dieser view ist für die Qualitätskontrolle gedacht - daher letzter popber überhaupt
DROP VIEW IF EXISTS views.v_pop_letzterpopber_overall CASCADE;
CREATE OR REPLACE VIEW views.v_pop_letzterpopber_overall AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  views.v_pop_letzterpopber0_overall."PopBerJahr"
FROM
  (apflora.pop
  INNER JOIN
    views.v_pop_letzterpopber0_overall
    ON apflora.pop."PopId" = views.v_pop_letzterpopber0_overall."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  views.v_pop_letzterpopber0_overall."PopBerJahr";

DROP VIEW IF EXISTS views.v_apber_uebe CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebe AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname",
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          views.v_ap_anzmassnbisjahr
          ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
        ON apflora._variable."JBerJahr" = apflora.apber."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.apber."JBerBeurteilung" = 1
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebe_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebe_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora._variable
      INNER JOIN
        (apflora.apber
        INNER JOIN
          views.v_ap_anzmassnbisjahr
          ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
        ON apflora._variable."JBerJahr" = apflora.apber."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.apber."JBerBeurteilung" = 1
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebkm CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebkm AS
SELECT
  beob.adb_eigenschaften."Artname",
  CASE
    WHEN beob.adb_eigenschaften."KefArt" = -1
    THEN 'Ja'
    ELSE ''
  END AS "FnsKefArt2",
  CASE
    WHEN Round((apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4,0) = (apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4
    THEN 'Ja'
    ELSE ''
  END AS "FnsKefKontrJahr2"
FROM
  (beob.adb_eigenschaften
    INNER JOIN
      ((views.v_ap_anzmassnbisjahr AS "vApAnzMassnBisJahr_1"
      INNER JOIN
        apflora.ap
        ON "vApAnzMassnBisJahr_1"."ApArtId" = apflora.ap."ApArtId")
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON
        (apflora._variable."JBerJahr" = "vApAnzMassnBisJahr_1"."TPopMassnJahr")
        AND (apflora.ap."ApArtId" = apflora.apber."ApArtId")
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND "vApAnzMassnBisJahr_1"."AnzahlMassnahmen" = '0'
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebma CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebma AS
SELECT
  beob.adb_eigenschaften."Artname",
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen"
FROM
  apflora._variable
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      views.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
    ON apflora._variable."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebma_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebma_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      views.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
    ON apflora._variable."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebme CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebme AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 5
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebme_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebme_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 5
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebne CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebne AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 3
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebne_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebne_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 3
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0;

DROP VIEW IF EXISTS views.v_apber_uebse CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebse AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 4
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebse_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebse_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 4
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebun CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebun AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN views.v_ap_apberrelevant ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 1168274204
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebun_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebun_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap INNER JOIN views.v_ap_apberrelevant ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 1168274204
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebwe CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebwe AS
SELECT
  apflora.apber.*,
  beob.adb_eigenschaften."Artname"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 6
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uebwe_apid CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebwe_apid AS
SELECT
  apflora.ap."ApArtId"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    ((beob.adb_eigenschaften
    INNER JOIN
      (apflora.ap
      INNER JOIN
        views.v_ap_apberrelevant
        ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
      ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
    INNER JOIN
      ((apflora.apber
      INNER JOIN
        views.v_ap_anzmassnbisjahr
        ON apflora.apber."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.apber."JBerBeurteilung" = 6
  AND views.v_ap_anzmassnbisjahr."AnzahlMassnahmen" > 0
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebnb000 CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebnb000 AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr"
FROM
  (((apflora.ap
  INNER JOIN
    views.v_ap_anzmassnbisjahr
    ON apflora.ap."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
  INNER JOIN
    views.v_ap_apberrelevant
    ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
  LEFT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
  INNER JOIN
    apflora._variable
    ON views.v_ap_anzmassnbisjahr."TPopMassnJahr" = apflora._variable."JBerJahr"
WHERE
  apflora.apber."ApArtId" IS NULL
  AND apflora.ap."ApStatus" BETWEEN 1 AND 3;

DROP VIEW IF EXISTS views.v_apber_uebnb00 CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebnb00 AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber."JBerJahr"
FROM
  apflora._variable AS "tblKonstanten_1"
  INNER JOIN
    (((apflora.ap
    INNER JOIN
      views.v_ap_anzmassnbisjahr
      ON apflora.ap."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
    INNER JOIN
      views.v_ap_apberrelevant
      ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
    INNER JOIN
      (apflora.apber
      INNER JOIN
        apflora._variable
        ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = apflora.apber."ApArtId")
    ON "tblKonstanten_1"."JBerJahr" = views.v_ap_anzmassnbisjahr."TPopMassnJahr"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.apber."JBerBeurteilung" IS NULL;

DROP VIEW IF EXISTS views.v_apber_uebnb0 CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebnb0 AS
SELECT
  "ApArtId",
  "JBerJahr"
FROM
  views.v_apber_uebnb000
UNION SELECT
  "ApArtId",
  "JBerJahr"
FROM
  views.v_apber_uebnb00;

DROP VIEW IF EXISTS views.v_apber_uebnb CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uebnb AS
SELECT
 apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebse_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebe_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebme_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebwe_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebne_apid)
  AND apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebun_apid)
  AND apflora.ap."ApArtId" IN (SELECT * FROM views.v_apber_uebma_apid)
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uet01 CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uet01 AS
SELECT
  apflora.ap."ApArtId",
  beob.adb_eigenschaften."Artname",
  CASE
    WHEN apflora.ap."ApArtId" NOT IN (SELECT * FROM views.v_apber_uebma_apid)
    THEN 1
    ELSE 0
  END AS "keineMassnahmen",
  CASE
    WHEN beob.adb_eigenschaften."KefArt" = -1
    THEN 1
    ELSE 0
  END AS "FnsKefArt",
  CASE
    WHEN Round((apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4, 0) = (apflora._variable."JBerJahr" - beob.adb_eigenschaften."KefKontrolljahr") / 4
    THEN 1
    ELSE 0
  END AS "FnsKefKontrJahr"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      (views.v_ap_anzmassnbisjahr
      INNER JOIN
        apflora._variable
        ON views.v_ap_anzmassnbisjahr."TPopMassnJahr" = apflora._variable."JBerJahr")
      ON apflora.ap."ApArtId" = views.v_ap_anzmassnbisjahr."ApArtId")
    INNER JOIN
      views.v_ap_apberrelevant
      ON apflora.ap."ApArtId" = views.v_ap_apberrelevant."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_uet_veraengegenvorjahr CASCADE;
CREATE OR REPLACE VIEW views.v_apber_uet_veraengegenvorjahr AS
SELECT
  apflora.ap."ApArtId",
  apflora.apber."JBerVeraenGegenVorjahr",
  apflora.apber."JBerJahr"
FROM
  apflora.ap
  LEFT JOIN
    apflora.apber
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
  AND (
    apflora.apber."JBerJahr" IN (SELECT apflora._variable."JBerJahr" FROM apflora._variable)
    Or apflora.apber."JBerJahr" IS NULL
  );

DROP VIEW IF EXISTS views.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW views.v_tpop_statuswidersprichtbericht AS
SELECT
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "Bearbeitungsstand AP",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  apflora.tpopber."TPopBerEntwicklung",
  apflora.tpopber."TPopBerJahr"
FROM
  ((beob.adb_eigenschaften
  INNER JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          views.v_tpopber_letzterber
          ON
            (apflora.tpopber."TPopId" = views.v_tpopber_letzterber."TPopId")
            AND (apflora.tpopber."TPopBerJahr" = views.v_tpopber_letzterber."MaxvonTPopBerJahr"))
        ON apflora.tpop."TPopId" = apflora.tpopber."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode"
WHERE
  (
    apflora.ap."ApStatus" < 4
    AND (
      apflora.tpop."TPopHerkunft" = 101
      OR apflora.tpop."TPopHerkunft" = 202
    )
    AND apflora.tpopber."TPopBerEntwicklung" <> 8
  )
  OR (
    apflora.ap."ApStatus" < 4
    AND apflora.tpop."TPopHerkunft" NOT IN (101, 202)
    AND apflora.tpopber."TPopBerEntwicklung" = 8
  )
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

-- im Gebrauch (Access):
DROP VIEW IF EXISTS views.v_apber_injahr CASCADE;
CREATE OR REPLACE VIEW views.v_apber_injahr AS
SELECT
  apflora.ap.*,
  beob.adb_eigenschaften."Artname" AS "Art",
  apflora.apber."JBerId",
  apflora.apber."JBerJahr",
  apflora.apber."JBerVergleichVorjahrGesamtziel",
  apflora.apber."JBerBeurteilung",
  apflora.apber."JBerAnalyse",
  apflora.apber."JBerUmsetzung",
  apflora.apber."JBerErfko",
  apflora.apber."JBerATxt",
  apflora.apber."JBerBTxt",
  apflora.apber."JBerCTxt",
  apflora.apber."JBerDTxt",
  apflora.apber."JBerDatum",
  apflora.apber."JBerBearb",
  concat(apflora.adresse."AdrName", ', ', apflora.adresse."AdrAdresse") AS "Bearbeiter",
  apflora.apberuebersicht."JbuJahr",
  apflora.apberuebersicht."JbuBemerkungen",
  views.v_erstemassnproap."MinvonTPopMassnJahr" AS "ErsteMassnahmeImJahr"
FROM
  (beob.adb_eigenschaften
  INNER JOIN
    (apflora.ap
    LEFT JOIN
      views.v_erstemassnproap
      ON apflora.ap."ApArtId" = views.v_erstemassnproap."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  INNER JOIN
    (((apflora.apber
    LEFT JOIN
      apflora.adresse
      ON apflora.apber."JBerBearb" = apflora.adresse."AdrId")
    LEFT JOIN
      apflora.apberuebersicht
      ON apflora.apber."JBerJahr" = apflora.apberuebersicht."JbuJahr")
    INNER JOIN
      apflora._variable
      ON apflora.apber."JBerJahr" = apflora._variable."JBerJahr")
    ON apflora.ap."ApArtId" = apflora.apber."ApArtId"
WHERE
  apflora.ap."ApStatus" < 4
  AND apflora.ap."ApArtId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname";

DROP VIEW IF EXISTS views.v_apber_b2rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b2rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_b3rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b3rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_b4rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b4rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_b5rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b5rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  (
    apflora.popber."PopBerEntwicklung" = 4
    OR apflora.popber."PopBerEntwicklung" = 9
  )
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_b6rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b6rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  ((views.v_pop_letzterpopber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letzterpopber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popber
    ON
      (apflora.pop."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."PopId" = apflora.popber."PopId")
      AND (views.v_pop_letzterpopber."MaxvonPopBerJahr" = apflora.popber."PopBerJahr"))
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_b2rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b2rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        views.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = views.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpopber."TPopId" = views.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = views.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 3
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_b3rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b3rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        views.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = views.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpopber."TPopId" = views.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = views.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 2
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_b4rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b4rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        views.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = views.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpopber."TPopId" = views.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = views.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 1
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_b5rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b5rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        views.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = views.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpopber."TPopId" = views.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = views.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 4
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_b6rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_b6rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.tpop
  INNER JOIN
    (apflora.tpopber
    INNER JOIN
      (apflora.pop
      INNER JOIN
        views.v_tpop_letztertpopber
        ON apflora.pop."ApArtId" = views.v_tpop_letztertpopber."ApArtId")
      ON
        (apflora.tpopber."TPopId" = views.v_tpop_letztertpopber."TPopId")
        AND (apflora.tpopber."TPopBerJahr" = views.v_tpop_letztertpopber."MaxvonTPopBerJahr"))
    ON
      (apflora.tpop."PopId" = apflora.pop."PopId")
      AND (apflora.tpop."TPopId" = apflora.tpopber."TPopId")
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_c1rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c1rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  apflora._variable,
  (apflora.pop
  INNER JOIN
    apflora.tpop
    ON apflora.pop."PopId" = apflora.tpop."PopId")
  INNER JOIN
    apflora.tpopmassn
    ON apflora.tpop."TPopId" = apflora.tpopmassn."TPopId"
WHERE
  apflora.tpopmassn."TPopMassnJahr" <= apflora._variable."JBerJahr"
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.pop."PopHerkunft" <> 300
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_c3rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c3rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
      AND (views.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_c4rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c4rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
      AND (views.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 2
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_c5rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c5rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
      AND (views.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 3
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_c6rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c6rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 4
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_c7rpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c7rpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.pop."PopId"
FROM
  (views.v_pop_letztermassnber
  INNER JOIN
    apflora.pop
    ON views.v_pop_letztermassnber."ApArtId" = apflora.pop."ApArtId")
  INNER JOIN
    apflora.popmassnber
    ON
      (apflora.pop."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."PopId" = apflora.popmassnber."PopId")
      AND (views.v_pop_letztermassnber."MaxvonPopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
WHERE
  apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_apber_c3rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c3rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (views.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (views.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_c4rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c4rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (views.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (views.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  (apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 2)
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_c5rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c5rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (views.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (views.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 3
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_c6rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c6rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (views.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (views.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 4
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_apber_c7rtpop CASCADE;
CREATE OR REPLACE VIEW views.v_apber_c7rtpop AS
SELECT
  apflora.pop."ApArtId",
  apflora.tpop."TPopId"
FROM
  apflora.pop
  INNER JOIN
    ((views.v_tpop_letztermassnber
    INNER JOIN
      apflora.tpopmassnber
      ON
        (views.v_tpop_letztermassnber."TPopId" = apflora.tpopmassnber."TPopId")
        AND (views.v_tpop_letztermassnber."MaxvonTPopMassnBerJahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
    INNER JOIN
      apflora.tpop
      ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId")
    ON apflora.pop."PopId" = apflora.tpop."PopId"
WHERE
  apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = 5
GROUP BY
  apflora.pop."ApArtId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_pop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW views.v_pop_popberundmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  views.v_pop_berundmassnjahre."Jahr",
  apflora.popber."PopBerId",
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer",
  apflora.popmassnber."PopMassnBerId",
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      (((apflora.pop
      LEFT JOIN
        (views.v_pop_berundmassnjahre
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
          ON
            (views.v_pop_berundmassnjahre."Jahr" = apflora.popmassnber."PopMassnBerJahr")
            AND (views.v_pop_berundmassnjahre."PopId" = apflora.popmassnber."PopId"))
        ON apflora.pop."PopId" = views.v_pop_berundmassnjahre."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      LEFT JOIN
        (apflora.popber
        LEFT JOIN
          apflora.pop_entwicklung_werte
          ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId")
        ON
          (views.v_pop_berundmassnjahre."Jahr" = apflora.popber."PopBerJahr")
          AND (views.v_pop_berundmassnjahre."PopId" = apflora.popber."PopId"))
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  views.v_pop_berundmassnjahre."Jahr";

DROP VIEW IF EXISTS views.v_pop_mit_letzter_popber CASCADE;
CREATE OR REPLACE VIEW views.v_pop_mit_letzter_popber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popber."PopBerId" AS "PopBer Id",
  apflora.popber."PopBerJahr" AS "PopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "PopBer Entwicklung",
  apflora.popber."PopBerTxt" AS "PopBer Bemerkungen",
  apflora.popber."MutWann" AS "PopBer MutWann",
  apflora.popber."MutWer" AS "PopBer MutWer"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        (views.v_pop_letzterpopber0_overall
        LEFT JOIN
          (apflora.popber
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON apflora.popber."PopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId")
          ON
            (views.v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
            AND (views.v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
        ON apflora.pop."PopId" = views.v_pop_letzterpopber0_overall."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  views.v_pop_letzterpopber0_overall."PopBerJahr";

DROP VIEW IF EXISTS views.v_pop_mit_letzter_popmassnber CASCADE;
CREATE OR REPLACE VIEW views.v_pop_mit_letzter_popmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "AP ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.pop."MutWann" AS "Datensatz zuletzt geaendert",
  apflora.pop."MutWer" AS "Datensatz zuletzt geaendert von",
  apflora.popmassnber."PopMassnBerId" AS "PopMassnBer Id",
  apflora.popmassnber."PopMassnBerJahr" AS "PopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "PopMassnBer Entwicklung",
  apflora.popmassnber."PopMassnBerTxt" AS "PopMassnBer Interpretation",
  apflora.popmassnber."MutWann" AS "PopMassnBer MutWann",
  apflora.popmassnber."MutWer" AS "PopMassnBer MutWer"
FROM
  beob.adb_eigenschaften
  INNER JOIN
    (((apflora.ap
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        (views.v_pop_letzterpopbermassn
        LEFT JOIN
          (apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON apflora.popmassnber."PopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
          ON
            (views.v_pop_letzterpopbermassn."PopMassnBerJahr" = apflora.popmassnber."PopMassnBerJahr")
            AND (views.v_pop_letzterpopbermassn."PopId" = apflora.popmassnber."PopId"))
        ON apflora.pop."PopId" = views.v_pop_letzterpopbermassn."PopId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
WHERE
  beob.adb_eigenschaften."TaxonomieId" > 150
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  views.v_pop_letzterpopbermassn."PopMassnBerJahr";

DROP VIEW IF EXISTS views.v_tpop_popberundmassnber CASCADE;
CREATE OR REPLACE VIEW views.v_tpop_popberundmassnber AS
SELECT
  beob.adb_eigenschaften."TaxonomieId" AS "ApArtId",
  beob.adb_eigenschaften."Artname" AS "AP Art",
  apflora.ap_bearbstand_werte."DomainTxt" AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte."DomainTxt" AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte."HerkunftTxt" AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1"."HerkunftTxt" AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius (m)",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  views.v_tpop_berjahrundmassnjahr."Jahr",
  apflora.tpopber."TPopBerId" AS "TPopBer Id",
  apflora.tpopber."TPopBerJahr" AS "TPopBer Jahr",
  pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber."TPopBerTxt" AS "TPopBer Bemerkungen",
  apflora.tpopber."MutWann" AS "TPopBer MutWann",
  apflora.tpopber."MutWer" AS "TPopBer MutWer",
  apflora.tpopmassnber."TPopMassnBerJahr" AS "TPopMassnBer Jahr",
  tpopmassn_erfbeurt_werte."BeurteilTxt" AS "TPopMassnBer Entwicklung",
  apflora.tpopmassnber."TPopMassnBerTxt" AS "TPopMassnBer Interpretation",
  apflora.tpopmassnber."MutWann" AS "TPopMassnBer MutWann",
  apflora.tpopmassnber."MutWer" AS "TPopMassnBer MutWer"
FROM
  ((((((((((beob.adb_eigenschaften
  RIGHT JOIN
    apflora.ap
    ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId")
  RIGHT JOIN
    (apflora.pop
    RIGHT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte."DomainCode")
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode")
  LEFT JOIN
    apflora.pop_status_werte ON apflora.pop."PopHerkunft" = pop_status_werte."HerkunftId")
  LEFT JOIN
    apflora.pop_status_werte AS "domPopHerkunft_1"
    ON apflora.tpop."TPopHerkunft" = "domPopHerkunft_1"."HerkunftId")
  LEFT JOIN
    views.v_tpop_berjahrundmassnjahr
    ON apflora.tpop."TPopId" = views.v_tpop_berjahrundmassnjahr."TPopId")
  LEFT JOIN
    apflora.tpopmassnber
    ON
      (views.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopmassnber."TPopId")
      AND (views.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopmassnber."TPopMassnBerJahr"))
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.tpopmassnber."TPopMassnBerErfolgsbeurteilung" = tpopmassn_erfbeurt_werte."BeurteilId")
  LEFT JOIN
    apflora.tpopber
    ON
      (views.v_tpop_berjahrundmassnjahr."Jahr" = apflora.tpopber."TPopBerJahr")
      AND (views.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpopber."TPopId"))
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber."TPopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId"
ORDER BY
  beob.adb_eigenschaften."Artname",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  views.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS views.v_pop_berjahrundmassnjahrvontpop CASCADE;
CREATE OR REPLACE VIEW views.v_pop_berjahrundmassnjahrvontpop AS
SELECT
  apflora.tpop."PopId",
  views.v_tpop_berjahrundmassnjahr."Jahr"
FROM
  views.v_tpop_berjahrundmassnjahr
  INNER JOIN
    apflora.tpop
    ON views.v_tpop_berjahrundmassnjahr."TPopId" = apflora.tpop."TPopId"
GROUP BY
  apflora.tpop."PopId",
  views.v_tpop_berjahrundmassnjahr."Jahr";

DROP VIEW IF EXISTS views.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW views.v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber."TPopId",
  views.v_tpopber_letzteid."AnzTPopBer",
  apflora.tpopber."TPopBerId",
  apflora.tpopber."TPopBerJahr" AS "TPopBer Jahr",
  apflora.pop_entwicklung_werte."EntwicklungTxt" AS "TPopBer Entwicklung",
  apflora.tpopber."TPopBerTxt" AS "TPopBer Bemerkungen",
  apflora.tpopber."MutWann" AS "TPopBer MutWann",
  apflora.tpopber."MutWer" AS "TPopBer MutWer"
FROM
  views.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (views.v_tpopber_letzteid."MaxTPopBerId" = apflora.tpopber."TPopBerId")
      AND (views.v_tpopber_letzteid."TPopId" = apflora.tpopber."TPopId")
  LEFT JOIN
    apflora.pop_entwicklung_werte
    ON apflora.tpopber."TPopBerEntwicklung" = pop_entwicklung_werte."EntwicklungId";

-- funktioniert nicht, wenn letzeKontrolle als Unterabfrage eingebunden wird. Grund: Unterabfragen in der FROM-Klausel duerfen keine korrellierten Unterabfragen sein
DROP VIEW IF EXISTS views.v_tpop_anzkontrinklletzter CASCADE;
CREATE OR REPLACE VIEW views.v_tpop_anzkontrinklletzter AS
SELECT
  views.v_tpop_letzteKontrId."TPopId",
  views.v_tpop."ApArtId",
  views.v_tpop."Familie",
  views.v_tpop."AP Art",
  views.v_tpop."AP Status",
  views.v_tpop."AP Start im Jahr",
  views.v_tpop."AP Stand Umsetzung",
  views.v_tpop."AP verantwortlich",
  views.v_tpop."PopId",
  views.v_tpop."Pop Guid",
  views.v_tpop."Pop Nr",
  views.v_tpop."Pop Name",
  views.v_tpop."Pop Status",
  views.v_tpop."Pop bekannt seit",
  views.v_tpop."Pop Status unklar",
  views.v_tpop."Pop Begruendung fuer unklaren Status",
  views.v_tpop."Pop X-Koordinaten",
  views.v_tpop."Pop Y-Koordinaten",
  views.v_tpop."TPop ID",
  views.v_tpop."TPop Guid",
  views.v_tpop."TPop Nr",
  views.v_tpop."TPop Gemeinde",
  views.v_tpop."TPop Flurname",
  views.v_tpop."TPop Status",
  views.v_tpop."TPop bekannt seit",
  views.v_tpop."TPop Status unklar",
  views.v_tpop."TPop Begruendung fuer unklaren Status",
  views.v_tpop."TPop X-Koordinaten",
  views.v_tpop."TPop Y-Koordinaten",
  views.v_tpop."TPop Radius (m)",
  views.v_tpop."TPop Hoehe",
  views.v_tpop."TPop Exposition",
  views.v_tpop."TPop Klima",
  views.v_tpop."TPop Hangneigung",
  views.v_tpop."TPop Beschreibung",
  views.v_tpop."TPop Kataster-Nr",
  views.v_tpop."TPop fuer AP-Bericht relevant",
  views.v_tpop."TPop EigentuemerIn",
  views.v_tpop."TPop Kontakt vor Ort",
  views.v_tpop."TPop Nutzungszone",
  views.v_tpop."TPop BewirtschafterIn",
  views.v_tpop."TPop Bewirtschaftung",
  views.v_tpop."Teilpopulation zuletzt geaendert",
  views.v_tpop."Teilpopulation zuletzt geaendert von",
  views.v_tpop_letzteKontrId."AnzTPopKontr" AS "TPop Anzahl Kontrollen",
  views.v_tpopkontr."TPopKontrId",
  views.v_tpopkontr."Kontr Guid",
  views.v_tpopkontr."Kontr Jahr",
  views.v_tpopkontr."Kontr Datum",
  views.v_tpopkontr."Kontr Typ",
  views.v_tpopkontr."Kontr BearbeiterIn",
  views.v_tpopkontr."Kontr Ueberlebensrate",
  views.v_tpopkontr."Kontr Vitalitaet",
  views.v_tpopkontr."Kontr Entwicklung",
  views.v_tpopkontr."Kontr Ursachen",
  views.v_tpopkontr."Kontr Erfolgsbeurteilung",
  views.v_tpopkontr."Kontr Aenderungs-Vorschlaege Umsetzung",
  views.v_tpopkontr."Kontr Aenderungs-Vorschlaege Kontrolle",
  views.v_tpopkontr."Kontr X-Koord",
  views.v_tpopkontr."Kontr Y-Koord",
  views.v_tpopkontr."Kontr Bemerkungen",
  views.v_tpopkontr."Kontr Lebensraum Delarze",
  views.v_tpopkontr."Kontr angrenzender Lebensraum Delarze",
  views.v_tpopkontr."Kontr Vegetationstyp",
  views.v_tpopkontr."Kontr Konkurrenz",
  views.v_tpopkontr."Kontr Moosschicht",
  views.v_tpopkontr."Kontr Krautschicht",
  views.v_tpopkontr."Kontr Strauchschicht",
  views.v_tpopkontr."Kontr Baumschicht",
  views.v_tpopkontr."Kontr Bodentyp",
  views.v_tpopkontr."Kontr Boden Kalkgehalt",
  views.v_tpopkontr."Kontr Boden Durchlaessigkeit",
  views.v_tpopkontr."Kontr Boden Humusgehalt",
  views.v_tpopkontr."Kontr Boden Naehrstoffgehalt",
  views.v_tpopkontr."Kontr Oberbodenabtrag",
  views.v_tpopkontr."Kontr Wasserhaushalt",
  views.v_tpopkontr."Kontr Uebereinstimmung mit Idealbiotop",
  views.v_tpopkontr."Kontr Handlungsbedarf",
  views.v_tpopkontr."Kontr Ueberpruefte Flaeche",
  views.v_tpopkontr."Kontr Flaeche der Teilpopulation m2",
  views.v_tpopkontr."Kontr auf Plan eingezeichnet",
  views.v_tpopkontr."Kontr Deckung durch Vegetation",
  views.v_tpopkontr."Kontr Deckung nackter Boden",
  views.v_tpopkontr."Kontr Deckung durch ueberpruefte Art",
  views.v_tpopkontr."Kontr auch junge Pflanzen",
  views.v_tpopkontr."Kontr maximale Veg-hoehe cm",
  views.v_tpopkontr."Kontr mittlere Veg-hoehe cm",
  views.v_tpopkontr."Kontr Gefaehrdung",
  views.v_tpopkontr."Kontrolle zuletzt geaendert",
  views.v_tpopkontr."Kontrolle zuletzt geaendert von",
  views.v_tpopkontr."Anzahlen",
  views.v_tpopkontr."Zaehleinheiten",
  views.v_tpopkontr."Methoden"
FROM
  (views.v_tpop_letzteKontrId
  LEFT JOIN
    views.v_tpopkontr
    ON views.v_tpop_letzteKontrId."MaxTPopKontrId" = views.v_tpopkontr."TPopKontrId")
  INNER JOIN
    views.v_tpop
    ON views.v_tpop_letzteKontrId."TPopId" = views.v_tpop."TPopId";

DROP VIEW IF EXISTS views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.ap."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(concat('Pop: ', apflora.pop."PopNr"), concat('Pop: id=', apflora.pop."PopId")),
    COALESCE(concat(' > TPop: ', apflora.tpop."TPopNr"), concat(' > TPop: id=', apflora.tpop."TPopId")),
    '</a>'
  ) AS "link"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopId" NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
  )
  AND apflora.tpop."TPopId" IN (
    SELECT apflora.beobzuordnung."TPopId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beobzuordnung."TPopId" = views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."TPopId"
    WHERE
      views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS views.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW views.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId"
HAVING
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopId" NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl."Anzahl" > 0
  )
  AND apflora.tpop."TPopId" IN (
    SELECT apflora.beobzuordnung."TPopId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beobzuordnung."TPopId" = views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."TPopId"
    WHERE
      views.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS views.v_qk_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW views.v_qk_pop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "aktuell", der letzte Populations-Bericht meldet aber "erloschen":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      views.v_pop_letzterpopber0_overall
      ON
        (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
        AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
    ON apflora.popber."PopId" = apflora.pop."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.pop."PopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId"
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS views.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW views.v_qk2_pop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "aktuell", der letzte Populations-Bericht meldet aber "erloschen":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.popber
        INNER JOIN
          views.v_pop_letzterpopber0_overall
          ON
            (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
            AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
        ON apflora.popber."PopId" = apflora.pop."PopId")
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" = 8
  AND apflora.pop."PopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_qk_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW views.v_qk_pop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  ) AS "link"
FROM
  (apflora.pop
  INNER JOIN
    (apflora.popber
    INNER JOIN
      views.v_pop_letzterpopber0_overall
      ON
        (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
        AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
    ON apflora.popber."PopId" = apflora.pop."PopId")
  INNER JOIN
    apflora.tpop
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.popber."PopBerEntwicklung" < 8
  AND apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.pop."ApArtId",
  apflora.pop."PopId"
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS views.v_qk2_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW views.v_qk2_pop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.popber
      INNER JOIN
        views.v_pop_letzterpopber0_overall
        ON
          (v_pop_letzterpopber0_overall."PopBerJahr" = apflora.popber."PopBerJahr")
          AND (v_pop_letzterpopber0_overall."PopId" = apflora.popber."PopId"))
      ON apflora.popber."PopId" = apflora.pop."PopId")
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.popber."PopBerEntwicklung" < 8
  AND apflora.pop."PopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId";

DROP VIEW IF EXISTS views.v_qk_tpop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW views.v_qk_tpop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "aktuell", der letzte Teilpopulations-Bericht meldet aber "erloschen":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        views.v_tpop_letztertpopber0_overall
        ON
          (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
          AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
      ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS views.v_qk2_tpop_statusaktuellletzterpopbererloschen CASCADE;
CREATE OR REPLACE VIEW views.v_qk2_tpop_statusaktuellletzterpopbererloschen AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "aktuell", der letzte Teilpopulations-Bericht meldet aber "erloschen":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN
    apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          views.v_tpop_letztertpopber0_overall
          ON
            (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
        ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
      ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" = 8
  AND apflora.tpop."TPopHerkunft" IN (100, 200, 210)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_qk_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW views.v_qk_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  ) AS "link"
FROM
  apflora.pop
  INNER JOIN
    (apflora.tpop
    INNER JOIN
      (apflora.tpopber
      INNER JOIN
        views.v_tpop_letztertpopber0_overall
        ON
          (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
          AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
      ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
    ON apflora.tpop."PopId" = apflora.pop."PopId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" < 8
  AND apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  )
ORDER BY
  apflora.pop."ApArtId",
  concat(
    '<a href="http://apflora.ch/index.html?ap=',
    apflora.pop."ApArtId",
    '&pop=',
    apflora.pop."PopId",
    '&tpop=',
    apflora.tpop."TPopId",
    '" target="_blank">',
    COALESCE(
      concat('Pop: ', apflora.pop."PopNr"),
      concat('Pop: id=', apflora.pop."PopId")
    ),
    COALESCE(
      concat(' > TPop: ', apflora.tpop."TPopNr"),
      concat(' > TPop: id=', apflora.tpop."TPopId")
    ),
    '</a>'
  );

DROP VIEW IF EXISTS views.v_qk2_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW views.v_qk2_tpop_statuserloschenletzterpopberaktuell AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "aktuell":' AS "hw",
  array_agg(distinct ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[]) AS "url"
FROM
  apflora.ap
    INNER JOIN
    apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          views.v_tpop_letztertpopber0_overall
          ON
            (v_tpop_letztertpopber0_overall."TPopBerJahr" = apflora.tpopber."TPopBerJahr")
            AND (v_tpop_letztertpopber0_overall."TPopId" = apflora.tpopber."TPopId"))
        ON apflora.tpopber."TPopId" = apflora.tpop."TPopId")
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpopber."TPopBerEntwicklung" < 8
  AND apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopId" NOT IN (
    -- Ansiedlungen since apflora.tpopber."TPopBerJahr"
    SELECT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
      AND apflora.tpopmassn."TPopMassnJahr" IS NOT NULL
      AND apflora.tpopmassn."TPopMassnJahr" > apflora.tpopber."TPopBerJahr"
  )
GROUP BY
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS views.v_exportevab_beob CASCADE;
CREATE OR REPLACE VIEW views.v_exportevab_beob AS
SELECT
  concat('{', apflora.tpopkontr."ZeitGuid", '}') AS "fkZeitpunkt",
  concat('{', apflora.tpopkontr."TPopKontrGuid", '}') AS "idBeobachtung",
  COALESCE(apflora.adresse."EvabIdPerson", '{A1146AE4-4E03-4032-8AA8-BC46BA02F468}') AS fkAutor,
  apflora.ap."ApArtId" AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  /*
  Status in EvAB (offizielle Ansiedlung / inoffiziell): Abfrage muss kontrollieren, ob Ansiedlung besteht:
  - Ansiedlung besteht:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status < 200 (= ursprünglich) und keine Ansiedlung:
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Status >= 200(= angesiedelt) und keine Ansiedlung und Status unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status  >= 200 (= angesiedelt) und keine Ansiedlung und Status klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
  */
   CASE
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn."TPopId"
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn."TPopId" = apflora.tpopkontr."TPopId"
        AND apflora.tpopmassn."TPopMassnTyp" BETWEEN 1 AND 3
        AND apflora.tpopmassn."TPopMassnJahr" < apflora.tpopkontr."TPopKontrJahr"
    ) THEN 6
    WHEN apflora.tpop."TPopHerkunft" < 200 THEN 4
    WHEN apflora.tpop."TPopHerkunftUnklar" = 1 THEN 3
    ELSE 5
  END AS "fkAAINTRODUIT",
  /*
  Präsenz:
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr erloschen meldet:
    2 (erloschen/zerstört)
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr nicht erloschen meldet:
    3 (nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit))
  - sonst
    1 (vorhanden)
  */
  CASE
    WHEN (
      views.v_tpopkontr_maxanzahl."Anzahl" = 0
      AND EXISTS (
        SELECT
          "TPopId"
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber."TPopId" = apflora.tpopkontr."TPopId"
          AND apflora.tpopber."TPopBerEntwicklung" = 8
          AND apflora.tpopber."TPopBerJahr" = apflora.tpopkontr."TPopKontrJahr"
      )
    ) THEN 2
    WHEN views.v_tpopkontr_maxanzahl."Anzahl" = 0 THEN 3
    ELSE 1
  END AS "fkAAPRESENCE",
  apflora.tpopkontr."TPopKontrGefaehrdung" AS "MENACES",
  substring(apflora.tpopkontr."TPopKontrVitalitaet" from 1 for 200) AS "VITALITE_PLANTE",
  substring(apflora.tpop."TPopBeschr" from 1 for 244) AS "STATION",
  substring(
    concat(
      'Anzahlen: ',
      array_to_string(array_agg(apflora.tpopkontrzaehl."Anzahl"), ', '),
      ', Zaehleinheiten: ',
      string_agg(apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitTxt", ', '),
      ', Methoden: ',
      string_agg(apflora.tpopkontrzaehl_methode_werte."BeurteilTxt", ', ')
      )
    from 1 for 160
  ) AS "ABONDANCE",
  'C' AS "EXPERTISE_INTRODUIT",
  CASE
    WHEN "tblAdresse_2"."EvabIdPerson" IS NOT NULL
    THEN "tblAdresse_2"."AdrName"
    ELSE 'topos Marti & Müller AG Zürich'
  END AS "EXPERTISE_INTRODUITE_NOM"
FROM
  (apflora.ap
  LEFT JOIN
    apflora.adresse AS "tblAdresse_2"
    ON apflora.ap."ApBearb" = "tblAdresse_2"."AdrId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr."TPopKontrBearb" = apflora.adresse."AdrId")
        INNER JOIN
          views.v_tpopkontr_maxanzahl
          ON views.v_tpopkontr_maxanzahl."TPopKontrId" = apflora.tpopkontr."TPopKontrId")
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl."Zaehleinheit" = apflora.tpopkontrzaehl_einheit_werte."ZaehleinheitCode")
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl."Methode" = apflora.tpopkontrzaehl_methode_werte."BeurteilCode")
          ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr."TPopId")
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApArtId" > 150
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr."TPopKontrTyp" IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  AND apflora.tpop."TPopHerkunft" <> 201
  AND apflora.tpopkontr."TPopKontrJahr" IS NOT NULL
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    (
      apflora.tpop."TPopBekanntSeit" IS NOT NULL
      AND (apflora.tpopkontr."TPopKontrJahr" - apflora.tpop."TPopBekanntSeit") > 5
    )
    OR apflora.tpop."TPopHerkunft" IN (100, 101)
  )
GROUP BY
  apflora.tpopkontr."ZeitGuid",
  apflora.tpopkontr."TPopId",
  apflora.tpopkontr."TPopKontrGuid",
  apflora.tpopkontr."TPopKontrJahr",
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  views.v_tpopkontr_maxanzahl."Anzahl",
  apflora.tpopkontr."TPopKontrGefaehrdung",
  apflora.tpopkontr."TPopKontrVitalitaet",
  apflora.tpop."TPopBeschr",
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";
